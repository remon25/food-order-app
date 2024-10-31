import mongoose from "mongoose";
import { User } from "../../models/User";
import bcrypt from "bcrypt";


export async function POST(request) {
  const body = await request.json();
  mongoose.connect(process.env.MONGO_URL);
  const pass = body.password;
  if (!pass.length || pass.length < 6) {
    throw new Error("Das Passwort muss mindestens 6 Zeichen lang sein.");
  }

  const nothashed = pass;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(nothashed, salt);

  body.password = hashedPassword;

  const createdUser = await User.create(body);

  return Response.json(createdUser);
}
