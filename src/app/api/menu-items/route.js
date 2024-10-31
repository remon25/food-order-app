import mongoose from "mongoose";
import { MenuItem } from "../../models/menuItems";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const data = await req.json();

    const menuItemDoc = await MenuItem.create(data);

    return new Response(JSON.stringify(menuItemDoc), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create menu item" }),
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const { _id, ...data } = await req.json();

await MenuItem.findByIdAndUpdate(_id, data);
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to create menu item" }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

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
  mongoose.connect(process.env.MONGO_URL);
const url = new URL(req.url);
const _id = url.searchParams.get("_id");
await MenuItem.deleteOne({ _id });
return Response.json(true);
}