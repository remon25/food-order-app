import { model, models, Schema } from "mongoose";

const DeliveryPriceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    
  },
  { timestamps: true }
);



export const DeliveryPrice = models?.DeliveryPrice || model("DeliveryPrice", DeliveryPriceSchema);