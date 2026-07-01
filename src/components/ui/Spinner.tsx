import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizes = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
  text,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={`
          ${sizes[size]}
          rounded-full
          border-cyan-500/30
          border-t-cyan-400
          animate-spin
        `}
      />

      {text && (
        <p className="text-sm text-slate-400">
          {text}
        </p>
      )}
    </div>
  );
};

export default React.memo(Spinner);
