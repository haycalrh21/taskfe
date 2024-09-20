"use client";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

const Login = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // console.log(session);
  if (status === "authenticated") {
    router.replace("/"); // Ganti URL tanpa menambahkannya ke history
    return null; // Jangan render apapun jika sudah terautentikasi
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Panggil NextAuth signIn function
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Jangan redirect otomatis
    });

    if (result.error) {
      setError(result.error); // Tampilkan pesan error jika ada
    } else {
      // Redirect ke halaman setelah login sukses (misalnya home page)
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form onSubmit={handleLogin}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // Disable button saat loading
            className={`w-full px-4 py-2 ${
              loading ? "bg-gray-500" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
