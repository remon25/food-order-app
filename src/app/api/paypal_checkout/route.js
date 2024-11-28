import mongoose from "mongoose";
import { Order } from "@/app/models/Order";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const { cartProducts, address, subtotal, deliveryPrice, orderType } =
    await req.json();

  let finalTotalPrice;
  let computedDeliveryPrice;
  if (orderType === "delivery") {
    finalTotalPrice = subtotal + deliveryPrice;
    computedDeliveryPrice = deliveryPrice;
  } else if (orderType === "pickup") {
    finalTotalPrice = subtotal;
    computedDeliveryPrice = 0;
  }

  const orderDoc = await Order.create({
    name: address.name,
    email: address.email,
    phone: address.phone,
    city: address.city,
    streetAdress: address.streetAdress,
    buildNumber: address.buildNumber,
    postalCode: address.postalCode,
    deliveryTime: address.deliveryTime,
    cartProducts,
    paid: true,
    payOnDelivery: false,
    subtotal,
    deliveryPrice: computedDeliveryPrice,
    finalTotalPrice,
    paymentMethod: "paypal",
    orderType,
  });

  const success_url =
    process.env.NEXTAUTH_URL +
    "orders/" +
    orderDoc._id.toString() +
    "?clear-cart=1";

  return Response.json(success_url);
}
