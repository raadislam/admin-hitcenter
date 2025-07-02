import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthRedirect() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("hitcenter_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, []);
}
