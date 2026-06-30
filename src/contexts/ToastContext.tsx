import { createContext } from "react";
import type { ToastType } from "../components/common/Toast";

export interface ToastContextType {
  showToast: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);