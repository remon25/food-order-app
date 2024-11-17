import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { User } from "../../models/User";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function checkAdmin(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user || !user.admin) {
    throw new Error("Forbidden");
  }
  return session;
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const data = await req.json();
    const { _id, isAdmin, verified } = data;

    if (_id) {
      // Check admin permissions
      const adminSession = await checkAdmin(req);

      // Only admins can update `isAdmin` or `verified`
      if (isAdmin !== undefined || verified !== undefined) {
        await User.updateOne({ _id }, { $set: { isAdmin, verified } });
      } else {
        await User.updateOne({ _id }, { $set: data });
      }
    } else {
      // If no `_id`, user is updating their own profile
      const email = session.user.email;
      const user = await User.findOne({ email });

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      // Prevent non-admin users from modifying sensitive fields
      if (isAdmin !== undefined || verified !== undefined) {
        return new Response("Forbidden", { status: 403 });
      }

      await User.updateOne({ email }, { $set: data });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(JSON.stringify({ error: error.message }), { status });
  }
}


export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");

    if (_id) {
      await checkAdmin(req); 
      const user = await User.findOne({ _id }).lean();
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      const email = session.user.email;
      const user = await User.findOne({ email });

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      return new Response(JSON.stringify(user), { status: 200 });
    }
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(JSON.stringify({ error: error.message }), { status });
  }
}
