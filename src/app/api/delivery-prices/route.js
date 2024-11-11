import mongoose from "mongoose";
import { DeliveryPrice } from "../../models/DeliverPrices";

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export async function GET() {
  try {
    const deliveryPrices = await DeliveryPrice.find();
    return new Response(JSON.stringify(deliveryPrices), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch delivery prices" }),
      { status: 500 }
    );
  }
}
