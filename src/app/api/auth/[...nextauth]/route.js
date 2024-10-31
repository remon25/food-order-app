import mongoose from "mongoose";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "../../../libs/mongoConnect";

export const authOptions = {
  secret: process.env.SECRET,
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",

      id: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        mongoose.connect(process.env.MONGO_URL);

        const user = await User.findOne({ email });
        if (!user) {
          return null;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if (user && isPasswordValid) {
          return user;
        }

        return null;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
