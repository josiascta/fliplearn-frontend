import React from "react";

type BotaoPadraoProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function BotaoPadrao({
  children,
  className = "",
  ...props
}: BotaoPadraoProps) {
  return (
    <button
      className={`bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
