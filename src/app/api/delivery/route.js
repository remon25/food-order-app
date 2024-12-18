// import mongoose from "mongoose";
// import { Order } from "@/app/models/Order";
// import { MenuItem } from "@/app/models/menuItems";
// import { DeliveryPrice } from "@/app/models/DeliverPrices";
// import validator from "validator";
// import sanitizeHtml from "sanitize-html";

// export async function POST(req) {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const {
//       cartProducts,
//       address,
//       subtotal,
//       deliveryPrice,
//       paymentMethod = "cash",
//       orderType,
//     } = await req.json();

//     // Validate and sanitize address fields
//     if (!address.name || !address.email || !address.phone) {
//       return new Response("Missing required address fields", { status: 400 });
//     }

//     if (paymentMethod !== "cash") {
//       return new Response("Error in payment method", { status: 400 });
//     }

//     // Validate email
//     if (!validator.isEmail(address.email)) {
//       return new Response("Invalid email format", { status: 400 });
//     }

//     // Sanitize address fields
//     const sanitizedAddress = {
//       ...address,
//       name: sanitizeHtml(address.name),
//       email: sanitizeHtml(address.email),
//       phone: sanitizeHtml(address.phone),
//       city: sanitizeHtml(address.city),
//       streetAdress: sanitizeHtml(address.streetAdress),
//       buildNumber: sanitizeHtml(address.buildNumber),
//       postalCode: sanitizeHtml(address.postalCode),
//       deliveryTime: sanitizeHtml(address.deliveryTime),
//     };

//     // Validate and sanitize orderType
//     if (!["delivery", "pickup"].includes(orderType)) {
//       return new Response("Invalid order type", { status: 400 });
//     }

//     // Validate paymentMethod
//     if (!["paypal", "credit card", "cash"].includes(paymentMethod)) {
//       return new Response("Invalid payment method", { status: 400 });
//     }

//     // Fetch delivery price and minimum order for the city
//     let cityDeliveryInfo;
//     if (orderType === "delivery") {
//       cityDeliveryInfo = await DeliveryPrice.findOne({
//         name: sanitizedAddress.city,
//       }).lean();

//       if (!cityDeliveryInfo) {
//         return new Response("City not supported for delivery", { status: 400 });
//       }

//       if (cityDeliveryInfo.isFreeDelivery && deliveryPrice > 0) {
//         return new Response("Delivery is free for this city", { status: 400 });
//       }

//       if (!cityDeliveryInfo.isFreeDelivery && deliveryPrice === 0) {
//         return new Response("Delivery is not free for this city", {
//           status: 400,
//         });
//       }

//       if (subtotal < cityDeliveryInfo.minimumOrder) {
//         return new Response(
//           `The minimum order for delivery in ${sanitizedAddress.city} is ${cityDeliveryInfo.minimumOrder}`,
//           { status: 400 }
//         );
//       }
//     }

//     // Calculate final total price and delivery price
//     let finalTotalPrice;
//     let computedDeliveryPrice;
//     if (orderType === "delivery") {
//       finalTotalPrice = subtotal + deliveryPrice;
//       computedDeliveryPrice = deliveryPrice;
//     } else {
//       finalTotalPrice = subtotal;
//       computedDeliveryPrice = 0;
//     }

//     // Fetch menu items for price validation
//     const menuItems = await MenuItem.find({
//       _id: { $in: cartProducts.map((item) => item._id) },
//     }).lean();

//     // Calculate subtotal dynamically and validate
//     let calculatedSubtotal = 0;
//     const sanitizedCartProducts = [];

//     for (const product of cartProducts) {
//       const menuItem = menuItems.find(
//         (item) => item._id.toString() === product._id
//       );

//       if (!menuItem) {
//         return new Response(
//           `Product with _id ${product._id} does not exist in the database`,
//           { status: 400 }
//         );
//       }

//       if (menuItem.price !== parseFloat(product.price)) {
//         return new Response(`Price mismatch for product ${product.name}`, {
//           status: 400,
//         });
//       }

//       let productTotal = menuItem.price;

//       if (product.size) {
//         const selectedSize = menuItem.sizes.find(
//           (size) =>
//             size._id.toString() === product.size._id &&
//             size.price === product.size.price
//         );

//         if (!selectedSize) {
//           return new Response(
//             `Invalid size '${product.size.name}' for product ${product.name}`,
//             { status: 400 }
//           );
//         }

//         productTotal += selectedSize.price;
//       }

//       if (product.extras && product.extras.length > 0) {
//         for (const extra of product.extras) {
//           const selectedExtra = menuItem.extraIngredientPrice.find(
//             (menuExtra) =>
//               menuExtra._id.toString() === extra._id &&
//               menuExtra.price === extra.price
//           );

//           if (!selectedExtra) {
//             return new Response(
//               `Invalid extra '${extra.name}' for product ${product.name}`,
//               { status: 400 }
//             );
//           }

//           productTotal += selectedExtra.price;
//         }
//       }

//       calculatedSubtotal += productTotal;

//       const sanitizedProduct = {
//         _id: product._id,
//         image: sanitizeHtml(product.image),
//         name: sanitizeHtml(product.name),
//         description: sanitizeHtml(product.description),
//         category: product.category,
//         price: parseFloat(product.price),
//         sizes: product.sizes,
//         extraIngredientPrice: product.extraIngredientPrice,
//         size: product.size,
//         extras: product.extras,
//       };

//       sanitizedCartProducts.push(sanitizedProduct);
//     }

//     if (calculatedSubtotal !== subtotal) {
//       return new Response(
//         `Subtotal mismatch. Calculated: ${calculatedSubtotal}, Provided: ${subtotal}`,
//         { status: 400 }
//       );
//     }

//     const orderDoc = await Order.create({
//       name: sanitizedAddress.name,
//       email: sanitizedAddress.email,
//       phone: sanitizedAddress.phone,
//       city: sanitizedAddress.city,
//       streetAdress: sanitizedAddress.streetAdress,
//       buildNumber: sanitizedAddress.buildNumber,
//       postalCode: sanitizedAddress.postalCode,
//       deliveryTime: sanitizedAddress.deliveryTime,
//       cartProducts: sanitizedCartProducts,
//       paid: false,
//       payOnDelivery: true,
//       subtotal,
//       deliveryPrice: computedDeliveryPrice,
//       finalTotalPrice,
//       paymentMethod,
//       orderType,
//     });

//     const success_url =
//       process.env.NEXTAUTH_URL +
//       "orders/" +
//       orderDoc._id.toString() +
//       "?clear-cart=1";

//     return Response.json(success_url);
//   } catch (error) {
//     console.error(error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }

import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import { MenuItem } from "@/app/models/menuItems";
import { DeliveryPrice } from "@/app/models/DeliverPrices";
import validator from "validator";
import sanitizeHtml from "sanitize-html";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const {
      cartProducts,
      address,
      subtotal,
      deliveryPrice,
      paymentMethod = "cash",
      orderType,
    } = await req.json();

    // Validate and sanitize address fields
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

    if (!["delivery", "pickup"].includes(orderType)) {
      return new Response("Invalid order type", { status: 400 });
    }

    if (!["paypal", "credit card", "cash"].includes(paymentMethod)) {
      return new Response("Invalid payment method", { status: 400 });
    }

    let cityDeliveryInfo;
    if (orderType === "delivery") {
      cityDeliveryInfo = await DeliveryPrice.findOne({
        name: sanitizedAddress.city,
      }).lean();

      if (!cityDeliveryInfo) {
        return new Response("City not supported for delivery", { status: 400 });
      }

      if (subtotal < cityDeliveryInfo.minimumOrder) {
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
      paymentMethod,
      orderType,
    });

    const expertOrderData = {
      version: 1,
      broker: "antalya-harsefeld.de",
      id: orderDoc._id.toString(),
      ordertime: new Date().toISOString(),
      deliverytime: new Date().toISOString(),
      customerinfo: sanitizedAddress.name,
      orderprice: finalTotalPrice,
      orderdiscount: 0,
      notification: orderType === "delivery" ? false : true,
      deliverycost: computedDeliveryPrice,
      customer: {
        phone: sanitizedAddress.phone,
        email: sanitizedAddress.email,
        name: sanitizedAddress.name,
        street:
          orderType === "delivery"
            ? `${sanitizedAddress.streetAdress} ${sanitizedAddress.buildNumber}`
            : "Ing.-Honnef-Str. 13",
        zip: orderType === "delivery" ? sanitizedAddress.postalCode : "21509",
        location: orderType === "delivery" ? sanitizedAddress.city : "Glinde",
      },
      payment: {
        type: 0,
        provider: "",
        transactionid: "",
        prepaid: 0,
      },
      items: sanitizedCartProducts.map((product) => {
        const items = [];

        if (product.size) {
          items.push({
            name: product.size.name,
            price: product.size.price,
            count: 1,
          });
        }

        if (product.extras && product.extras.length > 0) {
          product.extras.forEach((extra) => {
            items.push({
              name: extra.name,
              price: extra.price,
              count: 1,
            });
          });
        }

        return {
          count: 1,
          name: product.name,
          price: product.price,
          items, // Ensure each product has its own `items` array
          type: "FOOD",
        };
      }),
    };


    // Send the order data to ExpertOrder API using PUT
    const response = await fetch(process.env.EXPERTORDER_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        API_KEY: process.env.EXPERTORDER_API_KEY,
      },
      body: JSON.stringify(expertOrderData),
    });

    if (!response.ok) {
      console.error("ExpertOrder API Error:", await response.text());
      return new Response("Failed to push order to ExpertOrder", {
        status: 500,
      });
    } else {
      console.log("Order pushed to ExpertOrder successfully");
    }

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
