"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthHookProps, LoginParams } from "../types/auth";
import { HookChildrenProp } from "../types/children";
import { api } from "@/utils/api";

const AuthContext = createContext({} as AuthHookProps);

export const AuthProvider = ({ children }: HookChildrenProp) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.clear();
    }
  }, [token]);

  const login = async (loginParams: LoginParams) => {
    const { data, status } = await api.post(`/tecadi/api/oauth2/v1/token`, null, { params: { grant_type: "password", ...loginParams } });
    if (status === 201) {
      setToken(data.access_token);
    }
  };
  const logout = () => {
    setToken("");
  };

  return <AuthContext.Provider value={{ token, setToken, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
