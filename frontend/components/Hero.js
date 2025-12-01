"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useCallback, useRef } from "react";

export default function Hero() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isNavigating = useRef(false); // Prevent multiple pushes

  // Debounced handler to avoid spam clicks in prod
  const handleButtonClick = useCallback(() => {
    if (isNavigating.current || isPending) return; // Guard against loops
    isNavigating.current = true;

    startTransition(() => {
      try {
        router.push("/products");
      } catch (error) {
        console.error("Navigation failed:", error); // Log for Vercel Function logs
        isNavigating.current = false; // Reset on error
      }
    });

    // Reset after a short delay (adjust if needed)
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  }, [router, isPending]);

  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-8">Welcome!</h1>
      <button
        onClick={handleButtonClick}
        disabled={isPending || isNavigating.current}
        className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
      >
        {isPending ? "Loading..." : "Shop Now"}
      </button>
    </div>
  );
}