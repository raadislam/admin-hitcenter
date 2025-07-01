import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRequireAuth() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("hitcenter_token");
    if (!token) {
      router.replace("/login");
    }
  }, []);
}
