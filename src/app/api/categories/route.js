import mongoose from "mongoose";
import { Category } from "../../models/Category";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
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
}


export async function POST(req) {
  try {
    await checkAdmin(req); 

    const { name } = await req.json();
    const categoryDoc = await Category.create({ name });

    return new Response(JSON.stringify(categoryDoc), { status: 201 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create category" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await checkAdmin(req); 

    const { name, _id } = await req.json();
    await Category.updateOne({ _id }, { name });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update category" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await Category.find();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch categories" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await checkAdmin(req); 

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    await Category.deleteOne({ _id });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete category" }),
      { status: error.message ? status : 500 }
    );
  }
}
