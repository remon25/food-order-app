import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "../../models/User";

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);

  const data = await req.json();
  const { _id } = data;

  if (_id) {
    await User.updateOne({ _id }, data);
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    const user = await User.findOne({ email });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    await User.updateOne({ email }, data);
  }

  return Response.json({ success: true });
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");
  if (_id) {
    const user = await User.findOne({ _id }).lean();
    return Response.json(user);
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return Response.json({});
    }
    return Response.json(await User.findOne({ email }));
  }
}
