"use client";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Hero() {
  const router = useRouter();

  const goToProducts = () => {
    startTransition(() => {
      router.push("/products");
    });
  };

  return (
    <button onClick={goToProducts} className="...">
      Shop Now
    </button>
  );
}