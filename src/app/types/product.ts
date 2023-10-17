import { AxiosRequestConfig } from "axios";
import { Dispatch, SetStateAction } from "react";

export interface Product {
  codigo: string;
  codigoCliente: string;
  descricao: string;
  pesoBruto: string;
  pesoLiquido: string;
  grupo: string;
  um: string;
}
export interface ProductHookProps {
  handleListProduct: (listProductsParams: AxiosRequestConfig) => void;
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
