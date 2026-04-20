import React from 'react';
import ExternalLinkIcon from '@/components/ui/external-link-icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  withIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  fullWidth = false,
  withIcon = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-[5px] font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group";

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-secondary border border-transparent",
    secondary: "bg-brand-secondary text-white hover:bg-brand-primary border border-transparent",
    outline: "border border-brand-primary/50 bg-white text-brand-dark hover:bg-brand-bg-light",
    ghost: "bg-transparent text-brand-dark hover:bg-brand-bg-light",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-sm",
    lg: "px-9 py-4 text-base",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
      {withIcon && (
        <ExternalLinkIcon size={16} className="ml-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </button>
  );
};

export default Button;