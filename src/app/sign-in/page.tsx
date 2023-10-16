"use client";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "@/utils/api";
import { useEffect } from "react";
import Image from "next/image";
import * as yup from "yup";

interface LoginProps {
  username: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleOnClick = () => {
    router.push("sign-up");
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Código do usuário é obrigatório"),
    password: yup.string().required("Senha é obrigatória"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit = async (data: LoginProps) => {
    try {
      const response = await api.post(`/login`, null, { params: { ...data } });
      if (typeof localStorage !== "undefined") {
        if (response.status === 200) {
          localStorage.setItem("token", response.data.refresh_token);
          toast.success("Logado com sucesso!");
          router.push("/");
          return;
        }

        toast.error(response.data.message);
        return;
      } else {
        toast.error("O navegador não suporta localStorage.");
        return;
      }
    } catch (error) {
      toast.error("Código de usuário ou senha inválidos");
    }
  };

  return (
    <div className="flex h-100 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <ToastContainer />
      <div className="md:mx-auto md:w-full md:max-w-md">
        <Image className="mx-auto h-40 w-auto" src="/tecadi-logo.png" alt="Your Company" width={500} height={500} />
        <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Entre com sua conta</h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit(handleOnSubmit)}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Usuário
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="username"
                autoComplete="username"
                required
                placeholder="Código de usuário"
                className="block w-full rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                {...register("username")}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Senha
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Senha"
                required
                className="block w-full rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                {...register("password")}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Ainda não possui um cadastro?
          <a
            href="#"
            className="font-semibold ps-1 leading-6 text-blue-600 hover:text-blue-500"
            onClick={(e) => {
              e.preventDefault();
              handleOnClick();
            }}
          >
            Cadastre-se aqui!
          </a>
        </p>
      </div>
    </div>
  );
}
