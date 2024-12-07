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

    // Verify that the payment was successful
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

    if (orderDoc.paymentMethod !== "paypal") {
      return new Response("Not a PayPal order", { status: 400 });
    }

    // Step 4: Mark the order as paid
    await Order.updateOne({ paypalOrderId }, { paid: true });

    // Step 5: Push the order to ExpertOrder API
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
        zip: orderDoc.orderType === "delivery" ? orderDoc.postalCode : "21509",
        location: orderDoc.orderType === "delivery" ? orderDoc.city : "Glinde",
      },
      payment: {
        type: 3,
        provider: "PayPal",
        transactionid: paypalOrderId,
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
          items,
          type: "FOOD",
        };
      }),
    };

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
      } else {
        console.log("Order pushed to ExpertOrder successfully");
      }
    } catch (err) {
      console.error("Error while sending data to ExpertOrder:", err);
    }

    // Step 6: Return success response
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
