import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
      // validate: (value) => {
      //   if (!value.length || value.length < 6) {
      //     throw new Error("Das Passwort muss mindestens 6 Zeichen lang sein.");
      //   }
      // },
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    streetAdress: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    city: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// UserSchema.post("validate", (user) => {

// });

export const User = models?.User || model("User", UserSchema);
