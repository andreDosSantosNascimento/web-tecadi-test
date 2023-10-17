import { AxiosRequestConfig } from "axios";
import { Dispatch, SetStateAction } from "react";

export interface Product {
  codigo: string;
  codigoCliente: string;
  descricao: string;
  pesoBruto: number;
  pesoLiquido: number;
  grupo: string;
  um: string;
  saldo: number;
}
export interface ProductHookProps {
  handleListProduct: (listProductsParams: AxiosRequestConfig) => void;
  handleSaveProduct: (data: ProductSaveData, config: AxiosRequestConfig) => void;
  handleGetProduct: (listProductsParams: AxiosRequestConfig) => Promise<Product>;
  setProducts: Dispatch<SetStateAction<Product[]>>;
  products: Product[];
}

export interface ListProductsParams {
  token: string;
  offset: number;
  limit: number;
  codigo: string;
}

export interface ListProductsSearchParams {
  codigo?: string | undefined;
  offset: number;
  limit: number;
}

export interface ProductSaveData {
  codigo: string;
  codigoCliente: string;
  descricao: string;
  pesoBruto: number;
  pesoLiquido: number;
  grupo: string;
  um: string;
}
