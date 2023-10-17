"use client";
import { AuthProvider } from "./auth";
import { HookChildrenProp } from "../types/children";

export function Hooks({ children }: HookChildrenProp) {
  return <AuthProvider>{children}</AuthProvider>;
}
