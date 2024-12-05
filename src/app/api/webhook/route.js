const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { Order } from "@/app/models/Order";

export async function POST(req) {
  const sig = req.headers.get("Stripe-Signature");
  let event;

  // Verify the Stripe event signature
  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  // Handle the successful payment event
  if (event.type === "checkout.session.completed") {
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === "paid";

    if (isPaid) {
      // Update the order status to paid
      await Order.updateOne({ _id: orderId }, { paid: true });

      // Fetch the order from your database (assuming Order.findById or similar method)
      const orderDoc = await Order.findById(orderId);

      // Prepare the data for ExpertOrder
      const expertOrderData = {
        version: 1,
        broker: "antalya-harsefeld.de",
        id: orderDoc._id.toString(),
        ordertime: new Date().toISOString(),
        deliverytime: new Date().toISOString(),
        customerinfo: orderDoc.name,
        orderprice: orderDoc.finalTotalPrice,
        orderdiscount: 0,
        notification: orderDoc.orderType === "delivery" ? false : true,
        deliverycost: orderDoc.deliveryPrice,
        customer: {
          phone: orderDoc.phone,
          email: orderDoc.email,
          name: orderDoc.name,
          street:
            orderDoc.orderType === "delivery"
              ? `${orderDoc.streetAdress} ${orderDoc.buildNumber}`
              : "Ing.-Honnef-Str. 13",
          zip:
            orderDoc.orderType === "delivery" ? orderDoc.postalCode : "21509",
          location:
            orderDoc.orderType === "delivery" ? orderDoc.city : "Glinde",
        },
        payment: {
          type: 3,
          provider: "Stripe",
          transactionid: event?.data?.object?.payment_intent,
          prepaid: orderDoc.finalTotalPrice,
        },
        items: orderDoc.cartProducts.map((product) => {
          const items = [];

          if (product.size) {
            items.push({
              name: product.size.name,
              price: product.size.price,
              count: 1,
            });
          }

          if (product.extras && product.extras.length > 0) {
            product.extras.forEach((extra) => {
              items.push({
                name: extra.name,
                price: extra.price,
                count: 1,
              });
            });
          }

          return {
            count: 1,
            name: product.name,
            price: product.price,
            items, // Ensure each product has its own `items` array
            type: "FOOD",
          };
        }),
      };

      // Send the order data to ExpertOrder API using PUT
      try {
        const response = await fetch(process.env.EXPERTORDER_URL, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            API_KEY: process.env.EXPERTORDER_API_KEY,
          },
          body: JSON.stringify(expertOrderData),
        });

        if (!response.ok) {
          console.error("ExpertOrder API Error:", await response.text());
          return new Response("Failed to push order to ExpertOrder", {
            status: 500,
          });
        } else {
          console.log("Order pushed to ExpertOrder successfully");
        }
      } catch (err) {
        console.error("Error while sending data to ExpertOrder:", err);
        return new Response("Failed to push order to ExpertOrder", {
          status: 500,
        });
      }
    }
  }

  return Response.json({ received: true });
}
