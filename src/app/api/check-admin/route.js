import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "../../models/User";

async function connectDB() {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user || !user.admin) {
    return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
  }

  return new Response(JSON.stringify({ isAdmin: true }), { status: 200 });
}
