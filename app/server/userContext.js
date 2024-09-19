"use client";
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import baseUrl from "@/lib/baseUrl";

// Buat context User
export const UserContext = createContext();

// Provider untuk UserContext
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State untuk data pengguna
  const [error, setError] = useState(null); // State untuk error
  const [userState, setUserState] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fungsi untuk mendapatkan data pengguna
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/auth/getUser`, {
        withCredentials: true,
      });
      setUser(response.data.data);
      setError(null);
    } catch (error) {
      setUser(null);
      setError(error.response?.data || error.message);
    }
  };

  // Ambil data pengguna saat komponen dimuat
  useEffect(() => {
    fetchUser();
  }, []);

  // Fungsi untuk logout
  const logout = async () => {
    try {
      await axios.get(`${baseUrl}/auth/logout`, {
        withCredentials: true,
      });
      setUser(null); // Menghapus data pengguna setelah logout
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
      fetchUser(); // Memperbarui data pengguna setelah registrasi
    } catch (error) {
      console.error(
        "Error registering user:",
        error.response?.data || error.message
      );
      throw error; // Lempar error untuk ditangani di komponen
    }
  };

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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
