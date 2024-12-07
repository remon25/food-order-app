import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
import { DeliveryPrice } from "@/app/models/DeliverPrices";
import { MenuItem } from "@/app/models/menuItems";
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.NEXT_PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { cartProducts, address, subtotal, deliveryPrice, orderType } =
      await req.json();

    // Step 1: Validate and sanitize address fields
    if (!address.name || !address.email || !address.phone) {
      return new Response("Missing required address fields", { status: 400 });
    }
    if (!validator.isEmail(address.email)) {
      return new Response("Invalid email format", { status: 400 });
    }

    const sanitizedAddress = {
      ...address,
      name: sanitizeHtml(address.name),
      email: sanitizeHtml(address.email),
      phone: sanitizeHtml(address.phone),
      city: sanitizeHtml(address.city),
      streetAdress: sanitizeHtml(address.streetAdress),
      buildNumber: sanitizeHtml(address.buildNumber),
      postalCode: sanitizeHtml(address.postalCode),
      deliveryTime: sanitizeHtml(address.deliveryTime),
    };

    // Step 2: Validate order type
    if (!["delivery", "pickup"].includes(orderType)) {
      return new Response("Invalid order type", { status: 400 });
    }

    // Fetch delivery price and minimum order for the city
    let cityDeliveryInfo;
    if (orderType === "delivery") {
      cityDeliveryInfo = await DeliveryPrice.findOne({
        name: sanitizedAddress.city,
      }).lean();

      if (!cityDeliveryInfo) {
        console.error(
          "City not supported for delivery:",
          sanitizedAddress.city
        );
        return new Response("City not supported for delivery", { status: 400 });
      }

      if (cityDeliveryInfo.isFreeDelivery && deliveryPrice > 0) {
        console.error("Delivery should be free for this city:", deliveryPrice);
        return new Response("Delivery is free for this city", { status: 400 });
      }

      if (!cityDeliveryInfo.isFreeDelivery && deliveryPrice === 0) {
        console.error(
          "Delivery price required for non-free delivery city:",
          deliveryPrice
        );
        return new Response("Delivery is not free for this city", {
          status: 400,
        });
      }

      if (subtotal < cityDeliveryInfo.minimumOrder) {
        console.error(
          "Subtotal below minimum order for city:",
          subtotal,
          cityDeliveryInfo.minimumOrder
        );
        return new Response(
          `The minimum order for delivery in ${sanitizedAddress.city} is ${cityDeliveryInfo.minimumOrder}`,
          { status: 400 }
        );
      }
    }
    let finalTotalPrice;
    let computedDeliveryPrice;
    if (orderType === "delivery") {
      finalTotalPrice = subtotal + deliveryPrice;
      computedDeliveryPrice = deliveryPrice;
    } else {
      finalTotalPrice = subtotal;
      computedDeliveryPrice = 0;
    }

    // Step 4: Calculate final total price and validate cart items
    const menuItems = await MenuItem.find({
      _id: { $in: cartProducts.map((item) => item._id) },
    }).lean();

    let calculatedSubtotal = 0;
    const sanitizedCartProducts = [];

    for (const product of cartProducts) {
      const menuItem = menuItems.find(
        (item) => item._id.toString() === product._id
      );

      if (!menuItem || menuItem.price !== parseFloat(product.price)) {
        return new Response("Price mismatch or invalid product", {
          status: 400,
        });
      }

      let productTotal = menuItem.price;

      if (product.size) {
        const selectedSize = menuItem.sizes.find(
          (size) =>
            size._id.toString() === product.size._id &&
            size.price === product.size.price
        );
        if (!selectedSize) {
          return new Response("Invalid size selected", { status: 400 });
        }
        productTotal += selectedSize.price;
      }

      if (product.extras) {
        for (const extra of product.extras) {
          const selectedExtra = menuItem.extraIngredientPrice.find(
            (menuExtra) =>
              menuExtra._id.toString() === extra._id &&
              menuExtra.price === extra.price
          );
          if (!selectedExtra) {
            return new Response("Invalid extra selected", { status: 400 });
          }
          productTotal += selectedExtra.price;
        }
      }

      calculatedSubtotal += productTotal;

      sanitizedCartProducts.push({
        _id: product._id,
        image: sanitizeHtml(product.image),
        name: sanitizeHtml(product.name),
        description: sanitizeHtml(product.description),
        price: parseFloat(product.price),
        size: product.size,
        extras: product.extras,
      });
    }

    if (calculatedSubtotal !== subtotal) {
      return new Response("Subtotal mismatch", { status: 400 });
    }

    finalTotalPrice =
      orderType === "delivery" ? subtotal + computedDeliveryPrice : subtotal;

    // Step 5: Create the PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: finalTotalPrice.toFixed(2),
          },
        },
      ],
    });

    const paypalResponse = await client.execute(request);

    // Step 6: Create the order in the database
    const orderDoc = await Order.create({
      name: sanitizedAddress.name,
      email: sanitizedAddress.email,
      phone: sanitizedAddress.phone,
      city: sanitizedAddress.city,
      streetAdress: sanitizedAddress.streetAdress,
      buildNumber: sanitizedAddress.buildNumber,
      postalCode: sanitizedAddress.postalCode,
      deliveryTime: sanitizedAddress.deliveryTime,
      cartProducts: sanitizedCartProducts,
      payOnDelivery: false,
      subtotal,
      deliveryPrice: computedDeliveryPrice,
      finalTotalPrice,
      paymentMethod: "paypal",
      orderType,
      paypalOrderId: paypalResponse.result.id,
      paid: false,
    });

    // Return PayPal order ID and order details
    return Response.json({
      orderId: orderDoc._id,
      paypalOrderId: paypalResponse.result.id,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
