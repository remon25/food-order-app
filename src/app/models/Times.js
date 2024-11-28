import { model, models, Schema } from "mongoose";

const timesSchema = new Schema(
  {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

timesSchema.statics.getOrCreate = async function () {
  const existing = await this.findOne();
  if (!existing) {
    return this.create({ start: "10:00", end: "22:00" }); // Default values
  }
  return existing;
};

timesSchema.index({}, { unique: true });

export const Times = models?.Times || model("Times", timesSchema);
