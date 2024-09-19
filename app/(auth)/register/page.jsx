// register.js
"use client";
import { useContext } from "react";
import { UserContext } from "../../server/userContext";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Register = () => {
  const { registerUser, userState, handlerUserInput } = useContext(UserContext);
  const router = useRouter();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(userState);
      toast.success("Registrasi berhasil!");
      router.push("/login");
    } catch (error) {
      toast.error("Registrasi gagal. Coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userState.name}
              onChange={handlerUserInput("name")}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={userState.email}
              onChange={handlerUserInput("email")}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={userState.password}
              onChange={handlerUserInput("password")}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
