"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import useSWR from "swr";
import baseUrl from "@/lib/baseUrl";

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
  } = useSWR(`${baseUrl}/auth/getUser`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 30000,
  });

  // Fungsi untuk logout
  const logout = async () => {
    try {
      await axios.get(`${baseUrl}/auth/logout`, { withCredentials: true });
      mutate(null); // Menghapus data pengguna dan memperbarui SWR cache
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
      await axios.post(`${baseUrl}/auth/register`, userData, {
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
        registerUser,
        userState,
        handlerUserInput,
        mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
