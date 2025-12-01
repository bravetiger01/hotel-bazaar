"use client";
import { useRouter } from "next/navigation"; // instead of react-router-dom

export default function MyComponent() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/products"); // 👈 Redirect safely to /products
  };

  return (
    <div>
      <h1>Welcome!</h1>
      <button
        onClick={handleButtonClick}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition transform duration-200"
      >
        Shop Now
      </button>
    </div>
  );
}
