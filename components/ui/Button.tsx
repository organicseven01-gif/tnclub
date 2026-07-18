import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark active:bg-brand-dark",
  secondary: "bg-brand-dark text-white hover:opacity-90",
  outline: "border-2 border-brand text-brand hover:bg-brand/5",
  ghost: "text-brand hover:bg-brand/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-12 px-5 text-sm",
  lg: "h-14 px-6 text-base",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "lg",
    fullWidth = true,
    icon,
    children,
    className,
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, fullWidth: _f, icon: _i, children: _c, className: _cl, ...buttonRest } =
    props as ButtonAsButton;

  return (
    <button className={classes} {...buttonRest}>
      {icon}
      {children}
    </button>
  );
}
