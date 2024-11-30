import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.NEXT_PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { paypalOrderId } = await req.json();

    if (!paypalOrderId) {
      return new Response("Missing PayPal order ID", { status: 400 });
    }

    // Step 1: Capture the PayPal order
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});
    const captureResponse = await client.execute(request);

    // Verify that the payment was successful by checking the status
    if (captureResponse.result.status !== "COMPLETED") {
      return new Response("Payment not completed", { status: 400 });
    }

    // Step 2: Retrieve the corresponding order in the database
    const orderDoc = await Order.findOne({ paypalOrderId }).lean();

    if (!orderDoc) {
      return new Response("Order not found", { status: 404 });
    }

    // Step 3: Verify that the order has not already been marked as paid
    if (orderDoc.paid) {
      return new Response("Order already marked as paid", { status: 400 });
    }

    // Step 4: Mark the order as paid
    await Order.updateOne({ paypalOrderId }, { paid: true });

    // Step 5: Return the success URL
    return Response.json({
      successUrl:
        process.env.NEXTAUTH_URL +
        "orders/" +
        orderDoc._id.toString() +
        "?clear-cart=1",
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
