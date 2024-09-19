"use client";
import { createContext, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import baseUrl from "@/lib/baseUrl"; // Path ke baseUrl harus benar

// Fetcher function untuk SWR
const fetcher = async (url) => {
  const response = await axios.get(`${baseUrl}${url}`, {
    withCredentials: true,
  });
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
      mutate(); // Memperbarui SWR cache setelah logout
    } catch (error) {
      console.error(
        "Error logging out:",
        error.response?.data || error.message
      );
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
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
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
    setUserState((prev) => ({ ...prev, [field]: e.target.value }));
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
