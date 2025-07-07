"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("hitcenter_token")
        : null;

    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
      if (pathname.startsWith("/dashboard")) {
        router.replace("/login");
      }
    }
    setChecking(false);
  }, [router, pathname]);

  return { checking, loggedIn };
}
