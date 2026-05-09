"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const base = fullWidth ? "w-full " : "";

  const classes: Record<string, string> = {
    primary: `${base}btn-primary`,
    secondary: `${base}btn-secondary`,
    ghost: `${base}btn-ghost`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${classes[variant]} ${className} ${
        disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
      }`}
    >
      {children}
    </button>
  );
}
