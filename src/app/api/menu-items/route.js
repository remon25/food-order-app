import mongoose from "mongoose";
import { MenuItem } from "../../models/menuItems";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { User } from "@/app/models/User";

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

    const data = await req.json();
    const menuItemDoc = await MenuItem.create(data);

    return new Response(JSON.stringify(menuItemDoc), { status: 201 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create menu item" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await checkAdmin(req); 

    const { _id, ...data } = await req.json();
    const updatedItem = await MenuItem.findByIdAndUpdate(_id, data, {
      new: true,
    });

    return new Response(JSON.stringify(updatedItem), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update menu item" }),
      { status: error.message ? status : 500 }
    );
  }
}

export async function GET() {
  try {
    const menuItems = await MenuItem.find();
    return new Response(JSON.stringify(menuItems), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch menu items" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await checkAdmin(req); 

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    await MenuItem.deleteOne({ _id });

    return new Response(JSON.stringify(true), { status: 200 });
  } catch (error) {
    const status = error.message === "Unauthorized" ? 401 : 403;
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete menu item" }),
      { status: error.message ? status : 500 }
    );
  }
}
