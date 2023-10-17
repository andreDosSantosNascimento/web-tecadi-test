"use client";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

export default function ProductRegister() {
  const router = useRouter();

  const grupos = ["SPRI", "RITR", "MINE", "SOVE", "SUMI"];
  const ums = ["UN", "KG", "AP", "CX"];
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const [selectedGroup, setSelectedGroup] = useState(grupos[0]);
  const [selectedUm, setSelectedUm] = useState(ums[0]);

  const validationSchema = yup.object().shape({
    codigoCliente: yup.string().required("Código do cliente é obrigatório"),
    descricao: yup.string().required("Descrição é obrigatória"),
    pesoBruto: yup.string().required("Peso bruto é obrigatório"),
    pesoLiquido: yup.string().required("Peso líquido é obrigatório"),
  });
  const { handleSubmit, register } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [token, setToken] = useState<String>(localStorage.getItem("token") || "");

  const handleOnSubmit = async (data: { codigoCliente: string; descricao: string; pesoBruto: string; pesoLiquido: string }) => {
    try {
      await api.post("product", { ...data, grupo: selectedGroup, um: selectedUm }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Sucesso ao cadastrar produto");
      router.push("/home");
    } catch (error) {
      toast.error("Erro ao cadastrar produto");
    }
  };
  return (
    <div className="content-center items-center">
      <Image
        className="mx-auto h-40 w-auto cursor-pointer"
        src="/tecadi-logo.png"
        alt="Your Company"
        width={500}
        height={500}
        onClick={() => router.push("/home")}
      />
      <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Cadastrar produto</h2>

      <form className="flex flex-col ps-80 pe-80 pt-20" method="POST" action={"#"} onSubmit={handleSubmit(handleOnSubmit)}>
        <Listbox value={selectedGroup} onChange={setSelectedGroup}>
          {({ open }) => (
            <>
              <input
                id="codigoCliente"
                type="text"
                autoComplete="codigoCliente"
                required
                className="block w-full rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
                placeholder="Código do cliente"
                {...register("codigoCliente")}
              />
              <input
                id="descricao"
                type="text"
                autoComplete="descricao"
                required
                className="block w-full rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
                placeholder="Descrição"
                {...register("descricao")}
              />
              <input
                id="pesoBruto"
                type="number"
                autoComplete="pesoBruto"
                required
                className="block w-full rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
                placeholder="Peso bruto"
                {...register("pesoBruto")}
              />
              <input
                id="pesoLiquido"
                type="number"
                autoComplete="pesoLiquido"
                required
                className="block w-full rounded-md border-0 py-1.5 ps-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 mb-4"
                placeholder="Peso liquido"
                {...register("pesoLiquido")}
              />
              <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Grupos</Listbox.Label>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{selectedGroup}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {grupos.map((grupo) => (
                      <Listbox.Option
                        key={grupo}
                        className={({ active }) =>
                          classNames(active ? "bg-indigo-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")
                        }
                        value={grupo}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span className={classNames(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{grupo}</span>
                            </div>

                            {selected ? (
                              <span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
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
              <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Unidade de medida</Listbox.Label>
              <div className="relative mt-2">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                  <span className="flex items-center">
                    <span className="ml-3 block truncate">{selectedUm}</span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {ums.map((um) => (
                      <Listbox.Option
                        key={um}
                        className={({ active }) =>
                          classNames(active ? "bg-indigo-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")
                        }
                        value={um}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span className={classNames(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}>{um}</span>
                            </div>

                            {selected ? (
                              <span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
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
          className="mt-4 flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
