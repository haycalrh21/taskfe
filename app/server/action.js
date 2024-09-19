"use server";
import axios from "axios";

const serverUrl = "http://localhost:8000/api/v1";

export default async function loginUsers({ email, password }) {
  try {
    const response = await axios.post(
      `${serverUrl}/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.user && response.data.token) {
      return response.data;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Login gagal. Periksa email dan password Anda."
    );
  }
}
