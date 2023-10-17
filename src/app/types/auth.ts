import { Dispatch, SetStateAction } from "react";

export interface AuthHookProps {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  login: (loginParams: LoginParams) => void;
  logout: () => void;
}
export interface LoginParams {
  username: string;
  password: string;
}
