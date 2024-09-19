"use client";
import { createContext, useState } from "react";
import axios from "axios";
import useSWR from "swr";

// Set baseURL untuk axios
axios.defaults.baseURL = "http://localhost:4000"; // Ganti dengan URL backend Anda jika berbeda

// Fetcher function untuk SWR
const fetcher = async (url) => {
  const response = await axios.get(url, { withCredentials: true });
  return response.data.data;
};

// Buat context User
export const UserContext = createContext();

// Provider untuk UserContext
export const UserProvider = ({ children }) => {
  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/v1/auth/getUser", fetcher, {
    revalidateOnFocus: false, // Nonaktifkan revalidation saat fokus
    refreshInterval: 30000, // Polling setiap 30 detik
  });

  // Fungsi untuk logout
  const logout = async () => {
    try {
      await axios.get("/api/v1/auth/logout", { withCredentials: true });
      mutate(null); // Menghapus data pengguna dan memperbarui SWR cache
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fungsi untuk registrasi pengguna
  const registerUser = async (userData) => {
    try {
      await axios.post("/api/v1/auth/register", userData, {
        withCredentials: true,
      });
      mutate(); // Memperbarui SWR cache setelah registrasi
    } catch (error) {
      throw error; // Lempar error untuk ditangani di komponen
    }
  };

  // State untuk data pengguna
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handler untuk input pengguna
  const handlerUserInput = (field) => (e) => {
    setUserState({ ...userState, [field]: e.target.value });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        error,
        logout,
        mutate,
        registerUser,
        userState,
        handlerUserInput,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
