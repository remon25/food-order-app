// import mongoose from "mongoose";
// import { Order } from "@/app/models/Order";

// export async function POST(req) {
//   mongoose.connect(process.env.MONGO_URL);

//   const { cartProducts, address, subtotal, deliveryPrice, orderType } =
//     await req.json();

//   let finalTotalPrice;
//   let computedDeliveryPrice;
//   if (orderType === "delivery") {
//     finalTotalPrice = subtotal + deliveryPrice;
//     computedDeliveryPrice = deliveryPrice;
//   } else if (orderType === "pickup") {
//     finalTotalPrice = subtotal;
//     computedDeliveryPrice = 0;
//   }

//   const orderDoc = await Order.create({
//     name: address.name,
//     email: address.email,
//     phone: address.phone,
//     city: address.city,
//     streetAdress: address.streetAdress,
//     buildNumber: address.buildNumber,
//     postalCode: address.postalCode,
//     deliveryTime: address.deliveryTime,
//     cartProducts,
//     paid: true,
//     payOnDelivery: false,
//     subtotal,
//     deliveryPrice: computedDeliveryPrice,
//     finalTotalPrice,
//     paymentMethod: "paypal",
//     orderType,
//   });

//   const success_url =
//     process.env.NEXTAUTH_URL +
//     "orders/" +
//     orderDoc._id.toString() +
//     "?clear-cart=1";

//   return Response.json(success_url);
// }


import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
import { DeliveryPrice } from "@/app/models/DeliverPrices";
import { MenuItem } from "@/app/models/menuItems";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { cartProducts, address, subtotal, deliveryPrice, orderType } =
      await req.json();

    // Validate and sanitize address fields
    if (!address.name || !address.email || !address.phone) {
      return new Response("Missing required address fields", { status: 400 });
    }

    // Validate email
    if (!validator.isEmail(address.email)) {
      return new Response("Invalid email format", { status: 400 });
    }

    // Sanitize address fields
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

    // Validate orderType
    if (!["delivery", "pickup"].includes(orderType)) {
      return new Response("Invalid order type", { status: 400 });
    }

    // Fetch delivery price and minimum order for the city if order type is delivery
    let cityDeliveryInfo;
    if (orderType === "delivery") {
      cityDeliveryInfo = await DeliveryPrice.findOne({
        name: sanitizedAddress.city,
      }).lean();

      if (!cityDeliveryInfo) {
        return new Response("City not supported for delivery", { status: 400 });
      }

      if (cityDeliveryInfo.isFreeDelivery && deliveryPrice > 0) {
        return new Response("Delivery is free for this city", { status: 400 });
      }

      if (!cityDeliveryInfo.isFreeDelivery && deliveryPrice === 0) {
        return new Response("Delivery is not free for this city", {
          status: 400,
        });
      }

      if (subtotal < cityDeliveryInfo.minimumOrder) {
        return new Response(
          `The minimum order for delivery in ${sanitizedAddress.city} is ${cityDeliveryInfo.minimumOrder}`,
          { status: 400 }
        );
      }
    }

    // Calculate final total price and delivery price
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

    // Calculate subtotal dynamically and validate
    let calculatedSubtotal = 0;
    const sanitizedCartProducts = [];

    for (const product of cartProducts) {
      const menuItem = menuItems.find(
        (item) => item._id.toString() === product._id
      );

      if (!menuItem) {
        return new Response(
          `Product with _id ${product._id} does not exist in the database`,
          { status: 400 }
        );
      }

      if (menuItem.price !== parseFloat(product.price)) {
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
            return new Response(
              `Invalid extra '${extra.name}' for product ${product.name}`,
              { status: 400 }
            );
          }

          productTotal += selectedExtra.price;
        }
      }

      calculatedSubtotal += productTotal;

      const sanitizedProduct = {
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
      };

      sanitizedCartProducts.push(sanitizedProduct);
    }

    if (calculatedSubtotal !== subtotal) {
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
      paid: false,
      payOnDelivery: true,
      subtotal,
      deliveryPrice: computedDeliveryPrice,
      finalTotalPrice,
      paymentMethod: "paypal", // Default payment method
      orderType,
    });

    const success_url =
      process.env.NEXTAUTH_URL +
      "orders/" +
      orderDoc._id.toString() +
      "?clear-cart=1";

    return Response.json(success_url);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
