import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import { MenuItem } from "@/app/models/menuItems";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const { cartProducts, address, deliveryPrice, subtotal } = await req.json(); // Get deliveryPrice from request

  const finalTotalPrice = subtotal + deliveryPrice;
  const orderDoc = await Order.create({
    name: address.name,
    email: address.email,
    phone: address.phone,
    city: address.city,
    streetAdress: address.streetAdress,
    buildNumber: address.buildNumber,
    postalCode: address.postalCode,
    deliveryTime:address.deliveryTime,
    cartProducts,
    paid: false,
    payOnDelivery: false,
    subtotal,
    deliveryPrice,
    finalTotalPrice,
  });

  const stripeLineItems = [];

  for (const cartProduct of cartProducts) {
    const productInfo = await MenuItem.findById(cartProduct._id);
    let productPrice = cartProduct.price;

    if (cartProduct.size) {
      const size = productInfo.sizes.find(
        (size) => size._id.toString() === cartProduct.size._id.toString()
      );
      productPrice += size.price;
    }

    if (cartProduct.extras?.length > 0) {
      for (const cartProductExtraThing of cartProduct.extras) {
        const extraThingInfo = productInfo.extraIngredientPrice.find(
          (extraThing) =>
            extraThing._id.toString() === cartProductExtraThing._id.toString()
        );

        productPrice += extraThingInfo.price;
      }
    }
    const productName = cartProduct.name;

    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: productName,
        },
        unit_amount: productPrice * 100,
      },
    });
  }

  // Add delivery price as a line item
  if (deliveryPrice > 0) {
    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: "USD",
        product_data: {
          name: "Delivery Fee",
        },
        unit_amount: deliveryPrice * 100, // Convert delivery price to cents
      },
    });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: "payment",
    customer_email: address.email,
    success_url:
      process.env.NEXTAUTH_URL +
      "orders/" +
      orderDoc._id.toString() +
      "?clear-cart=1",
    cancel_url: process.env.NEXTAUTH_URL + "cart?canceled=1",
    metadata: { orderId: orderDoc._id.toString() },
    payment_intent_data: {
      metadata: { orderId: orderDoc._id.toString() },
    },
  });

  return Response.json(stripeSession.url);
}
