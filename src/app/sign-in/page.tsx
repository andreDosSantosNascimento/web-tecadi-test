"use client";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { LoginParams } from "../types/auth";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/auth";
import { useEffect } from "react";
import Image from "next/image";
import * as yup from "yup";

export default function SignIn() {
  const { token, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) router.push("/product/list");
  }, []);

  const schema = yup.object().shape({
    username: yup.string().required("Código do usuário é obrigatório"),
    password: yup.string().required("Senha é obrigatória"),
  });

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOnSubmit = async (loginParams: LoginParams) => {
    try {
      await login(loginParams);
      router.push("/product/list");
    } catch (error) {
      toast.error("Código de usuário ou senha inválidos");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center h-full">
        <Image className="" src="/tecadi-logo.png" alt="Logo Tecadi" width={200} height={200} />

        <form action="#" method="POST" onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col w-full items-center justify-center">
          <label htmlFor="username" className="text-md font-medium mb-2">
            Usuário
          </label>
          <input
            id="username"
            type="username"
            autoComplete="username"
            required
            placeholder="Código de usuário"
            className="block w-1/4 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            {...register("username")}
          />

          <label htmlFor="password" className="text-md font-medium mb-2 mt-2">
            Senha
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            required
            className="block w-1/4 rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            {...register("password")}
          />

          <button
            type="submit"
            className="flex w-1/4 mt-4 justify-center rounded-md bg-blue-600 p-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Entrar
          </button>
        </form>
      </div>
    </>
  );
}
