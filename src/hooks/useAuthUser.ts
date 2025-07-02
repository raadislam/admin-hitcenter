"use client";
import { useEffect, useState } from "react";

export function useAuthUser() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const userStr =
      typeof window !== "undefined"
        ? localStorage.getItem("hitcenter_user")
        : null;
    if (userStr) setUser(JSON.parse(userStr));
  }, []);
  return user;
}
