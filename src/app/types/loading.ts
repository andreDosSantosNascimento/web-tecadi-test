import { Dispatch, SetStateAction } from "react";

export interface LoadingHookProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}
