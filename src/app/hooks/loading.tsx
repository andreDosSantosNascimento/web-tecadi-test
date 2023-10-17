"use client";
import { createContext, useContext, useState } from "react";
import { HookChildrenProp } from "../types/children";
import { LoadingHookProps } from "../types/loading";

const LoadingContext = createContext({} as LoadingHookProps);

export const LoadingHook = ({ children }: HookChildrenProp) => {
  const [loading, setLoading] = useState(false);

  return <LoadingContext.Provider value={{ loading, setLoading }}>{children}</LoadingContext.Provider>;
};

export const useLoading = () => useContext(LoadingContext);
