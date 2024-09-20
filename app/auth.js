import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongoDb";
import User from "./models/user";
import jwt from "jsonwebtoken";

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.username) token.username = user.username; // Ubah `name` menjadi `username`
      if (user?.email) token.email = user.email;
      return token;
    },
    async session({ session, token }) {
      session.user = {
        _id: token._id,
        username: token.username, // Ubah `name` menjadi `username`
        email: token.email,
      };
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectMongo();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) throw new Error("Invalid email or password");

        return {
          _id: user._id,
          username: user.username, // Pastikan username dikembalikan di sini
          email: user.email,
        };
      },
    }),
  ],
};

export default NextAuth(authOptions);
