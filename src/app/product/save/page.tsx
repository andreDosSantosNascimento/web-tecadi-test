"use client";
import { Disclosure, Listbox, Menu, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Product, ProductSaveData } from "@/app/types/product";
import { yupResolver } from "@hookform/resolvers/yup";
import { Fragment, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/app/hooks/product";
import { useLoading } from "@/app/hooks/loading";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/auth";
import { AxiosRequestConfig } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

export default function ProductSave() {
  const { handleSaveProduct, handleGetProduct } = useProducts();
  const router = useRouter();
  const path = useSearchParams();
  const { token, logout } = useAuth();
  const { loading } = useLoading();

  const [codigo, setCodigo] = useState(path.get("codigo"));
  const grupos = ["SPRI", "RITR", "MINE", "SOVE", "SUMI"];
  const ums = ["UN", "KG", "AP", "CX"];

  const [selectedGroup, setSelectedGroup] = useState(grupos[0]);
  const [selectedUm, setSelectedUm] = useState(ums[0]);

  const [currentProduct, setCurrentProduct] = useState({
    codigo,
    codigoCliente: "",
    descricao: "",
    grupo: "SPRI",
    um: "UN",
  } as Product);

  useEffect(() => {
    if (currentProduct.codigo) {
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }, params: { limit: 50, offset: 0, ...(codigo ? { codigo } : {}) } };
      handleGetProduct(config)
        .then((data) => {
          setCurrentProduct(data);
        })
        .catch(() => {
          toast.error("Erro ao buscar produto");
        });
    }
  }, [router]);

  useEffect(() => {
    setSelectedGroup(currentProduct.grupo);
    setSelectedUm(currentProduct.um);
  }, [currentProduct]);

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  const validationSchema = yup.object().shape(
    currentProduct.codigo
      ? {
          codigo: yup.string().default(currentProduct.codigo),
          codigoCliente: yup.string().default(currentProduct.codigoCliente),
          descricao: yup.string().default(currentProduct.descricao),
          pesoBruto: yup.number().default(currentProduct.pesoBruto),
          pesoLiquido: yup.number().default(currentProduct.pesoLiquido),
          grupo: yup.string().default(selectedGroup),
          um: yup.string().default(selectedUm),
        }
      : {
          codigo: yup.string().default(path.get("codigo") || ""),
          codigoCliente: yup.string().required("Código do cliente é obrigatório"),
          descricao: yup.string().required("Descrição é obrigatória"),
          pesoBruto: yup.number().required("Peso bruto é obrigatório"),
          pesoLiquido: yup.number().required("Peso líquido é obrigatório"),
          grupo: yup.string().default(selectedGroup),
          um: yup.string().default(selectedUm),
        }
  );

  const { handleSubmit, register } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleOnSubmit = async (productSaveData: ProductSaveData) => {
    try {
      const data: ProductSaveData = { ...productSaveData, grupo: selectedGroup, um: selectedUm };
      const config: AxiosRequestConfig = { headers: { Authorization: `Bearer ${token}` }, ...(codigo ? { params: { codigo: codigo } } : {}) };

      await handleSaveProduct(data, config);
    } catch (error) {
      toast.error("Erro ao cadastrar produto");
    }
    router.push("/product/list");
  };
  return (
    <div className="h-full items-center">
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
                    className="flex-none ms-2 rounded-md bg-blue-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                    onClick={() => router.push("/product/list")}
                  >
                    Voltar
                  </button>
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
                            <a href="#" className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")} onClick={logout}>
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
      <div className="text-2xl font-bold text-center pt-10">
        <h2>{currentProduct.codigo ? "Atualizar produto: " + currentProduct.codigo : "Cadastrar produto"}</h2>
      </div>

      <form className="w-full mt-10 flex flex-col justify-center items-center" method="POST" action={"#"} onSubmit={handleSubmit(handleOnSubmit)}>
        <input
          id="codigoCliente"
          type="text"
          className="block w-1/4 rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
          placeholder="Código do cliente"
          defaultValue={currentProduct.codigoCliente}
          disabled={loading}
          {...register("codigoCliente")}
        />
        <input
          id="descricao"
          type="text"
          className="block w-1/4 rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
          placeholder="Descrição"
          defaultValue={currentProduct.descricao}
          disabled={loading}
          {...register("descricao")}
        />
        <input
          id="pesoBruto"
          type="number"
          className="block w-1/4 rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
          placeholder="Peso bruto"
          defaultValue={currentProduct.pesoBruto}
          disabled={loading}
          {...register("pesoBruto")}
        />
        <input
          id="pesoLiquido"
          type="number"
          className="block w-1/4 rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
          placeholder="Peso liquido"
          defaultValue={currentProduct.pesoLiquido}
          disabled={loading}
          {...register("pesoLiquido")}
        />
        <Listbox value={selectedGroup} onChange={setSelectedGroup}>
          {({ open }) => (
            <>
              <Listbox.Label className="w-1/4 block text-sm font-medium leading-6 text-gray-900">Grupos</Listbox.Label>
              <div className=" w-1/4 relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{selectedGroup}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="w-full absolute z-10 mt-1 max-h-56 w-1/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {grupos.map((grupo) => (
                      <Listbox.Option
                        key={grupo}
                        className={({ active }) =>
                          classNames(active ? "bg-blue-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")
                        }
                        value={grupo}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span className={classNames(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{grupo}</span>
                            </div>

                            {selected ? (
                              <span className={classNames(active ? "text-white" : "text-blue-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
        <Listbox value={selectedUm} onChange={setSelectedUm}>
          {({ open }) => (
            <>
              <Listbox.Label className="w-1/4 block text-sm font-medium leading-6 text-gray-900">Unidade de medida</Listbox.Label>
              <div className="w-1/4 relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{selectedUm}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="w-full absolute z-10 mt-1 max-h-56 w-1/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {ums.map((um) => (
                      <Listbox.Option
                        key={um}
                        className={({ active }) =>
                          classNames(active ? "bg-blue-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")
                        }
                        value={um}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span className={classNames(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{um}</span>
                            </div>

                            {selected ? (
                              <span className={classNames(active ? "text-white" : "text-blue-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>
        <button
          type="submit"
          className="mt-4 flex w-1/4 justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
