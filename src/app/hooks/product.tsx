"use client";
import { HookChildrenProp } from "../types/children";
import { Product, ProductHookProps, ProductSaveData } from "../types/product";
import { createContext, useContext, useState } from "react";
import { api } from "@/utils/api";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useLoading } from "./loading";
import { useRouter } from "next/navigation";

const ProductContext = createContext({} as ProductHookProps);

export const ProductHook = ({ children }: HookChildrenProp) => {
  const [products, setProducts] = useState([] as Product[]);
  const { setLoading } = useLoading();
  const router = useRouter();

  const handleSaveProduct = async (data: ProductSaveData, config: AxiosRequestConfig) => {
    setLoading(true);
    try {
      const { status } = await api.post("/tecadi/treinamento/produto", data, config);
      if (status === 401) {
        localStorage.clear();
      }
    } catch (error) {
      const { response } = error as AxiosError;
      if (response && response.status === 401) {
        localStorage.clear();
        router.push("/");
      }
    }
    setLoading(false);
  };
  const handleListProduct = async (listProductsParams: AxiosRequestConfig) => {
    setLoading(true);

    try {
      const { data, status } = await api.get("/tecadi/treinamento/produto", listProductsParams);
      if (status === 400) {
        setProducts([]);
      }
      setProducts(data.list);
    } catch (error) {
      const { response } = error as AxiosError;
      if (response && response.status === 400) {
        setProducts([]);
      }
      if (response && response.status === 401) {
        localStorage.clear();
        router.push("/");
      }
    }
    setLoading(false);
  };
  const handleGetProduct = () => {};
  const handleUpdateProduct = () => {};
  const handleRemoveProduct = () => {};
  return <ProductContext.Provider value={{ products, setProducts, handleListProduct, handleSaveProduct }}>{children}</ProductContext.Provider>;
};

export const useProducts = () => useContext(ProductContext);
