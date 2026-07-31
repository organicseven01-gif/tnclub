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
  primary:
    "bg-brand-gradient text-white shadow-cta hover:shadow-cta-hover hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985]",
  secondary:
    "bg-brand-dark text-white shadow-card hover:-translate-y-0.5 hover:shadow-soft active:translate-y-0 active:scale-[0.985]",
  outline:
    "border border-brand/30 bg-white/60 text-brand-dark hover:border-brand hover:bg-white active:scale-[0.985]",
  ghost: "text-brand hover:bg-brand/5 active:scale-[0.985]",
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
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 ease-out will-change-transform disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0",
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
