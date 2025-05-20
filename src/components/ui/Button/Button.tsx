import React from "react";
import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "black" | "transparent";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "sm", className, ...props }) => {
  const classes = classNames(
    {
      "bg-button-primary text-white hover:bg-button-primary-hover p-4": variant === "primary",
      "bg-neutrals-high text-white border-neutrals-medium border hover:bg-neutrals-medium p-2": variant === "black",
      "bg-neutrals-high text-white p-2": variant === "transparent",
      "text-base": size === "md",
    },
    className
  );

  return <button className={classes} {...props} />;
};

export default Button;
