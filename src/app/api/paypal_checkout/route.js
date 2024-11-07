import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Order } from "@/app/models/Order";
import { MenuItem } from "@/app/models/menuItems";

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);

  const { cartProducts, address, paid } = await req.json();
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  const orderDoc = await Order.create({
    userEmail,
    cartProducts,
    ...address,
    paid,
  });

  const success_url =
    process.env.NEXTAUTH_URL +
    "orders/" +
    orderDoc._id.toString() +
    "?clear-cart=1";

  return Response.json(success_url);
}
