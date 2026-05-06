import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "dark";
  className?: string;
  target?: string;
  rel?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const styles = {
  primary:
    "bg-[var(--primary)] text-white shadow-[0_16px_40px_rgba(134,195,19,0.28)] hover:bg-[var(--primary-dark)]",
  secondary:
    "border border-[var(--border)] bg-white/80 text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
  ghost: "bg-transparent text-[var(--primary)] hover:bg-[var(--secondary)]",
  dark: "bg-[var(--primary)] text-white shadow-[0_16px_40px_rgba(134,195,19,0.24)] hover:bg-[var(--primary-dark)]"
};

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className,
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200",
    styles[variant],
    className
  );

  if (href) {
    return (
      <Link className={classes} href={href} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  );
}
