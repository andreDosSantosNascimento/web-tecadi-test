"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "./hooks/auth";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      router.push("/product/list");
    }
    router.push("/sign-in");
  }, []);

  return <></>;
}
