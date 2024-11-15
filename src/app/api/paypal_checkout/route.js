import mongoose from "mongoose";
import { Order } from "@/app/models/Order";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const { cartProducts, address, subtotal, deliveryPrice} =
    await req.json();

  const finalTotalPrice = subtotal + deliveryPrice;

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
    deliveryPrice,
    finalTotalPrice,
    paymentMethod: "paypal",
  });

  const success_url =
    process.env.NEXTAUTH_URL +
    "orders/" +
    orderDoc._id.toString() +
    "?clear-cart=1";

  return Response.json(success_url);
}
