import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    name: String,
    email: String,
    phone: String,
    city: String,
    streetAdress: String,
    buildNumber: String,
    postalCode: String,
    cartProducts: Object,
    paid: { type: Boolean, default: false },
    payOnDelivery: { type: Boolean, default: false },
    deliveryTime: String,
    subtotal: Number,
    deliveryPrice: Number,
    finalTotalPrice: Number,
    paymentMethod: {
      type: String,
      enum: ["paypal", "credit card", "cash"],
      required: true,
    },
    orderType: {
      type: String,
      enum: ["delivery", "pickup"],
      required: true,
    },
    paypalOrderId: { type: String, required: false },
  },
  { timestamps: true }
);

OrderSchema.index(
  { paypalOrderId: 1, paymentMethod: 1 },
  { unique: true, partialFilterExpression: { paymentMethod: "paypal" } }
);

export const Order = models?.Order || model("Order", OrderSchema);
