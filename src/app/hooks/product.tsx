"use client";
import { HookChildrenProp } from "../types/children";
import { Product, ProductHookProps } from "../types/product";
import { createContext, useContext, useState } from "react";
import { api } from "@/utils/api";
import { AxiosRequestConfig } from "axios";

const ProductContext = createContext({} as ProductHookProps);

export const ProductHook = ({ children }: HookChildrenProp) => {
  const [products, setProducts] = useState([] as Product[]);

  const handleSaveProduct = () => {};
  const handleListProduct = async (listProductsParams: AxiosRequestConfig) => {
    try {
      const { data } = await api.get("/tecadi/treinamento/produto", listProductsParams);
      setProducts(data.list);
    } catch (error) {
      localStorage.clear();
    }
  };
  const handleGetProduct = () => {};
  const handleUpdateProduct = () => {};
  const handleRemoveProduct = () => {};
  return <ProductContext.Provider value={{ products, setProducts, handleListProduct }}>{children}</ProductContext.Provider>;
};

export const useProducts = () => useContext(ProductContext);
