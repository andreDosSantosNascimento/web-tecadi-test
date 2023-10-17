"use client";
import { HookChildrenProp } from "../types/children";
import { ProductHook } from "./product";
import { LoadingHook } from "./loading";
import { AuthHook } from "./auth";

export function Hooks({ children }: HookChildrenProp) {
  return (
    <LoadingHook>
      <AuthHook>
        <ProductHook>{children}</ProductHook>
      </AuthHook>
    </LoadingHook>
  );
}
