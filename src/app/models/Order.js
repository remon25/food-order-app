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
  },

  { timestamps: true }
);

export const Order = models?.Order || model("Order", OrderSchema);
