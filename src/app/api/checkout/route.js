import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import { MenuItem } from "@/app/models/menuItems";
import { DeliveryPrice } from "@/app/models/DeliverPrices";
import validator from "validator";
import sanitizeHtml from "sanitize-html";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const body = await req.json();

    const {
      cartProducts,
      address,
      deliveryPrice,
      subtotal,
      paymentMethod = "credit card",
      orderType,
    } = body;

    // Validate and sanitize address fields
    if (!address.name || !address.email || !address.phone) {
      console.error("Missing required address fields:", address);
      return new Response("Missing required address fields", { status: 400 });
    }

    if (paymentMethod !== "credit card") {
      return new Response("Error in payment method", { status: 400 });
    }

    if (!validator.isEmail(address.email)) {
      console.error("Invalid email format:", address.email);
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

    // Validate and sanitize orderType
    if (!["delivery", "pickup"].includes(orderType)) {
      console.error("Invalid order type:", orderType);
      return new Response("Invalid order type", { status: 400 });
    }

    // Validate paymentMethod
    if (paymentMethod !== "credit card") {
      console.error("Invalid payment method:", paymentMethod);
      return new Response("Payment method must be credit card", {
        status: 400,
      });
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

    // Fetch menu items for price validation
    const menuItems = await MenuItem.find({
      _id: { $in: cartProducts.map((item) => item._id) },
    }).lean();

    let calculatedSubtotal = 0;
    const sanitizedCartProducts = [];

    for (const product of cartProducts) {
      const menuItem = menuItems.find(
        (item) => item._id.toString() === product._id
      );

      if (!menuItem) {
        console.error("Product not found in database:", product._id);
        return new Response(
          `Product with _id ${product._id} does not exist in the database`,
          { status: 400 }
        );
      }

      if (menuItem.price !== parseFloat(product.price)) {
        console.error("Price mismatch for product:", product);
        return new Response(`Price mismatch for product ${product.name}`, {
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
          console.error(
            "Invalid size for product:",
            product.size,
            product.name
          );
          return new Response(
            `Invalid size '${product.size.name}' for product ${product.name}`,
            { status: 400 }
          );
        }

        productTotal += selectedSize.price;
      }

      if (product.extras && product.extras.length > 0) {
        for (const extra of product.extras) {
          const selectedExtra = menuItem.extraIngredientPrice.find(
            (menuExtra) =>
              menuExtra._id.toString() === extra._id &&
              menuExtra.price === extra.price
          );

          if (!selectedExtra) {
            console.error("Invalid extra for product:", extra, product.name);
            return new Response(
              `Invalid extra '${extra.name}' for product ${product.name}`,
              { status: 400 }
            );
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
        category: product.category,
        price: parseFloat(product.price),
        sizes: product.sizes,
        extraIngredientPrice: product.extraIngredientPrice,
        size: product.size,
        extras: product.extras,
      });
    }

    if (calculatedSubtotal !== subtotal) {
      console.error(
        "Subtotal mismatch. Calculated:",
        calculatedSubtotal,
        "Provided:",
        subtotal
      );
      return new Response(
        `Subtotal mismatch. Calculated: ${calculatedSubtotal}, Provided: ${subtotal}`,
        { status: 400 }
      );
    }

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
      paymentMethod: "credit card",
      orderType,
      paid: false,
    });

    const stripeLineItems = [];
    for (const product of cartProducts) {
      let productTotal = product.price;

      if (product.size) {
        const selectedSize = product.sizes.find(
          (size) =>
            size._id.toString() === product.size._id &&
            size.price === product.size.price
        );

        if (selectedSize) {
          productTotal += selectedSize.price;
        }
      }

      if (product.extras && product.extras.length > 0) {
        for (const extra of product.extras) {
          const selectedExtra = product.extraIngredientPrice.find(
            (menuExtra) =>
              menuExtra._id.toString() === extra._id &&
              menuExtra.price === extra.price
          );

          if (selectedExtra) {
            productTotal += selectedExtra.price;
          }
        }
      }

      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "EUR",
          product_data: { name: product.name },
          unit_amount: productTotal * 100,
        },
      });
    }

    if (orderType === "delivery" && deliveryPrice > 0) {
      stripeLineItems.push({
        quantity: 1,
        price_data: {
          currency: "EUR",
          product_data: { name: "Delivery Fee" },
          unit_amount: computedDeliveryPrice * 100,
        },
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: sanitizedAddress.email,
      success_url:
        process.env.NEXTAUTH_URL +
        "orders/" +
        orderDoc._id.toString() +
        "?clear-cart=1",
      cancel_url: process.env.NEXTAUTH_URL + "cart?canceled=1",
      metadata: { orderId: orderDoc._id.toString() },
      payment_intent_data: { metadata: { orderId: orderDoc._id.toString() } },
    });

    return Response.json(stripeSession.url);
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
