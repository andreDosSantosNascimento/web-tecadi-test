"use client";
import { Product, ProductHookProps, ProductSaveData } from "../types/product";
import { createContext, useContext, useState } from "react";
import { AxiosError, AxiosRequestConfig } from "axios";
import { HookChildrenProp } from "../types/children";
import { useRouter } from "next/navigation";
import { useLoading } from "./loading";
import { api } from "@/utils/api";
import { useAuth } from "./auth";
import { toast } from "react-toastify";

const ProductContext = createContext({} as ProductHookProps);

export const ProductHook = ({ children }: HookChildrenProp) => {
  const [products, setProducts] = useState([] as Product[]);
  const { setLoading } = useLoading();
  const { setToken } = useAuth();
  const router = useRouter();

  const handleSaveProduct = async (data: ProductSaveData, config: AxiosRequestConfig) => {
    setLoading(true);
    try {
      await api.post("/tecadi/treinamento/produto", data, config);
      setLoading(false);
      return;
    } catch (error) {
      const { response } = error as AxiosError;
      if (response && response.status === 401) {
        setToken("");
        setLoading(false);
        router.push("/");
      }
      if (response && response.status === 400) {
        try {
          await api.put("/tecadi/treinamento/produto", data, config);
        } catch (error) {
          const { response } = error as AxiosError;
          if (response && response.status === 400) {
            toast.error(response.data as String);
          }
        }
        setLoading(false);
      }
      setLoading(false);
    }
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
        setToken("");

        router.push("/");
      }
    }
    setLoading(false);
  };
  const handleGetProduct = async (listProductsParams: AxiosRequestConfig) => {
    setLoading(true);
    try {
      const { data } = await api.get("/tecadi/treinamento/produto", listProductsParams);
      const [product] = data.list;
      setLoading(false);
      if (product) {
        return product as Product;
      }

      return {
        codigo: "",
        codigoCliente: "",
        descricao: "",
        pesoBruto: 0,
        pesoLiquido: 0,
        grupo: "",
        um: "",
      } as Product;
    } catch (error) {
      const { response } = error as AxiosError;

      if (response && response.status === 401) {
        localStorage.clear();
        router.push("/");
      }

      setLoading(false);
      return {
        codigoCliente: "",
        descricao: "",
        pesoBruto: 0,
        pesoLiquido: 0,
        grupo: "",
        um: "",
      } as Product;
    }
  };
  const handleRemoveProduct = () => {};
  return (
    <ProductContext.Provider value={{ products, setProducts, handleListProduct, handleSaveProduct, handleGetProduct }}>{children}</ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
