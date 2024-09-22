// components/SplashScreen.jsx

"use client";
import { useState, useEffect } from "react";

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasi durasi splash screen (misalnya 3 detik)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null; // Jika sudah selesai loading, sembunyikan splash screen

  return (
    <div className="splash-screen">
      <img src="/images.jpg" alt="Splash Image" className="splash-image" />
    </div>
  );
}
