"use server";

import bcrypt from "bcryptjs";
import connectMongo from "@/lib/mongoDb";
import User from "../models/user";

// Server action untuk registrasi user
export async function registerUserAction(formData) {
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!username || !email || !password) {
    throw new Error("Semua field harus diisi");
  }

  // Koneksi ke MongoDB
  await connectMongo();

  // Cek apakah user sudah terdaftar
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User dengan email ini sudah terdaftar");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru
  const newUser = new User({
    username, // Menambahkan username di sini
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return JSON.stringify({ message: "User berhasil terdaftar" });
}

export async function fetchUsers() {
  await connectMongo();

  const users = await User.find({}); // Fetch all todos from the database

  return JSON.stringify(users); // Return todos as JSON
}
