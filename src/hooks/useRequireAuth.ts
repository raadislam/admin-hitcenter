"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useRequireAuth() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Only run on client!
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("hitcenter_token")
        : null;
    if (!token) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [router]);

  return { checking };
}
