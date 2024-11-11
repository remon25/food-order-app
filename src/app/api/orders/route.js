import mongoose from "mongoose";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "@/app/models/User";
import { Order } from "@/app/models/Order";

export async function GET(req) {
  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URL);
  }

  // Get session information
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userEmail = session.user.email;
  let isAdmin = false;

  // Retrieve user info to determine if they are an admin
  const userInfo = await User.findOne({ email: userEmail });
  if (userInfo) {
    isAdmin = userInfo.admin;
  }

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  
  // Handle specific order retrieval by ID
  if (_id) {
    const order = await Order.findById(_id);
    if (!order) {
      return new Response("Order not found", { status: 404 });
    }
    // Only allow admins or the owner of the order to view it
    if (isAdmin || order.email === userEmail) {
      return new Response(JSON.stringify(order), { status: 200 });
    } else {
      return new Response("Forbidden", { status: 403 });
    }
  }

  // If no specific order ID, retrieve all orders based on role
  if (isAdmin) {
    // Admin can access all orders
    const orders = await Order.find();
    return new Response(JSON.stringify(orders), { status: 200 });
  } else {
    // Regular users can only access their own orders
    const userOrders = await Order.find({ userEmail });
    return new Response(JSON.stringify(userOrders), { status: 200 });
  }
}
