"use client";
import { useContext, useState } from "react";
import { UserContext } from "../../server/userContext"; // Pastikan path ini benar
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Login = () => {
  const { userState, loginUser, handlerUserInput } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // Untuk menampilkan status loading jika diperlukan
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Mulai status loading
    try {
      await loginUser({
        email: userState.email,
        password: userState.password,
      });
      toast.success("Login berhasil!");
      router.push("/"); // Redirect setelah login
    } catch (error) {
      toast.error("Login gagal. Coba lagi.");
    } finally {
      setLoading(false); // Hentikan status loading
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
