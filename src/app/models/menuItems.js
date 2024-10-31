import mongoose, { model, models, Schema } from "mongoose";

const ExtraPriceSchema = new Schema({
  name: String,
  price: Number,
});

const MenuItemSchema = new Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sizes: {
      type: [ExtraPriceSchema],
    },
    extraIngredientPrice: {
      type: [ExtraPriceSchema],
    },
  },
  { timestamps: true }
);

export const MenuItem = models?.MenuItem || model("MenuItem", MenuItemSchema);
