const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { Order } from "@/app/models/Order";

export async function POST(req) {
  const sig = req.headers.get("Stripe-Signature");
  let event;
  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === "paid";
    if (isPaid) {
      await Order.updateOne({ _id: orderId }, { paid: true });
    }
  }
  return Response.json({ received: true });
}
