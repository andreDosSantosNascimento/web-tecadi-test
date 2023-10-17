import { Dispatch, MouseEvent, SetStateAction } from "react";

export interface AuthHookProps {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  login: (loginParams: LoginParams) => void;
  logout: (e: MouseEvent) => void;
}
export interface LoginParams {
  username: string;
  password: string;
}
