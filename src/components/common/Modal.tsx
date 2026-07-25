import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const maxWidths = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  maxWidth = "md",
  closeOnOverlay = true,
  closeOnEscape = true,
  showCloseButton = false,
  className = "",
}) => {
  //------------------------------------------
  // Bloquer le scroll de la page
  //------------------------------------------

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  //------------------------------------------
  // Fermeture avec Escape
  //------------------------------------------

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  //------------------------------------------

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={closeOnOverlay ? onClose : undefined}
    >
      <div
        className={`
          relative
          w-full
          ${maxWidths[maxWidth]}
          rounded-2xl
          bg-white
          text-black
          shadow-2xl
          animate-in
          zoom-in-95
          duration-200
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className="
              absolute
              right-4
              top-4
              rounded-lg
              p-2
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-700
            "
            aria-label="Fermer"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}

        {children}
      </div>
    </div>
  );
};

export default React.memo(Modal);