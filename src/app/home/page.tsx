"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { api } from "@/utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
interface Produto {
  codigo: string;
  codigoCliente: string;
  descricao: string;
  pesoBruto: string;
  pesoLiquido: string;
  grupo: string;
  um: string;
}

export default function Home() {
  const router = useRouter();
  const [offset, setOffset] = useState<number>(0);
  const [limit, setlimit] = useState<number>(50);
  const [codigo, setCodigo] = useState<string>("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [token, setToken] = useState<String>(localStorage.getItem("token") || "");

  const handleGetProducts = () => {
    api
      .get("product", { headers: { Authorization: `Bearer ${token}` }, params: { offset, limit, codigo } })
      .then(({ data }) => {
        setProdutos(data.list);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Erro ao buscar produtos");
      });
  };
  const validationSchema = yup.object().shape({
    offset: yup.number().required("Offset é obrigatório"),
    limit: yup.number().required("Limite é obrigatório"),
    codigo: yup.string(),
  });

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit = async ({ codigo = "", offset, limit }: { codigo?: string | undefined; offset: number; limit: number }) => {
    try {
      setCodigo(codigo);
      setOffset(offset);
      setlimit(limit);
    } catch (error) {
      toast.error("Erro ao Buscar produtos");
    }
  };
  useEffect(() => {
    handleGetProducts();
  }, [codigo, offset, limit]);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    if (!token) {
      router.push("/sign-in");
    }
    setToken(token);
  }, [router]);

  useEffect(() => {
    if (token) {
      handleGetProducts();
    }
  }, [token]);

  const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");
  const logout = () => {
    localStorage.clear();
    setToken("");
    router.push("/sign-in");
  };

  return (
    <>
      <ToastContainer />
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                  </Disclosure.Button>
                </div>
                <div className="flex content-center items-center">
                  <button
                    type="button"
                    className="flex-none rounded-md me-2 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={() => router.push("/new-product")}
                  >
                    Novo produto
                  </button>
                  <form className="flex" action="#" method="POST" onSubmit={handleSubmit(handleOnSubmit)}>
                    <input
                      id="codigo-produto"
                      type="text"
                      autoComplete="codigo-produto"
                      className="flex w-1/4 me-2 h-10 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      placeholder="Código do produto"
                      defaultValue={codigo}
                      {...register("codigo")}
                    />
                    <input
                      id="offset"
                      type="number"
                      autoComplete="offset"
                      required
                      className="flex w-2/12 me-2 h-10 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      placeholder="Offset"
                      defaultValue={offset}
                      {...register("offset")}
                    />
                    <input
                      id="limit"
                      type="number"
                      autoComplete="limit"
                      required
                      className="flex w-2/12 me-2 h-10 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                      placeholder="Limite"
                      defaultValue={limit}
                      {...register("limit")}
                    />
                    <button
                      type="submit"
                      className="flex-none rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    >
                      Procurar
                    </button>
                  </form>
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                          color="white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}
                              onClick={(e) => {
                                e.preventDefault();
                                logout();
                              }}
                            >
                              Sair
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Código do produto</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Código do cliente</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Grupo</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Peso bruto</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Peso líquido</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Unidade de medida</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Editar</th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Excluir</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {produtos.map((item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-no-wrap">
                <div className="text-sm leading-5 text-gray-900">{item.codigo}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <div className="text-sm leading-5 text-gray-900">{item.codigoCliente}</div>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="px-2 inline-flex text-xs leading-5">{item.descricao}</span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="px-2 inline-flex text-xs leading-5">{item.grupo}</span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="px-2 inline-flex text-xs leading-5">{item.pesoBruto}</span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="px-2 inline-flex text-xs leading-5">{item.pesoLiquido}</span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="px-2 inline-flex text-xs leading-5">{item.um}</span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="px-2 inline-flex text-xs leading-5">
                  <button
                    type="submit"
                    className="flex-none rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                  >
                    Editar
                  </button>
                </span>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap">
                <span className="px-2 inline-flex text-xs leading-5">
                  <button
                    type="submit"
                    className="flex-none rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  >
                    Excluir
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
