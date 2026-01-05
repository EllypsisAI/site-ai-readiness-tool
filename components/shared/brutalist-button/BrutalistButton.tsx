'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'command';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BrutalistButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  animate?: boolean;
}

const BrutalistButton = forwardRef<HTMLButtonElement, BrutalistButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      animate = true,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-mono font-medium
      border-2 transition-all duration-150
      focus:outline-none focus:ring-2 focus:ring-accent-amber focus:ring-offset-2 focus:ring-offset-background-primary
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      ${fullWidth ? 'w-full' : ''}
    `;

    const variantStyles = {
      primary: `
        bg-accent-amber text-foreground-inverse
        border-accent-amber
        hover:bg-accent-gold hover:border-accent-gold
        active:scale-[0.98]
        shadow-sm hover:shadow-lg hover:shadow-amber-20
      `,
      secondary: `
        bg-transparent text-foreground-primary
        border-border-default
        hover:bg-background-tertiary hover:border-border-emphasis
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-foreground-secondary
        border-transparent
        hover:bg-background-tertiary hover:text-foreground-primary
        active:scale-[0.98]
      `,
      command: `
        bg-background-code text-accent-success
        border-border-subtle
        hover:bg-background-secondary hover:border-border-default
        active:scale-[0.98]
        before:content-['$_'] before:text-accent-amber
      `,
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs rounded-sm',
      md: 'px-6 py-2.5 text-sm rounded-sm',
      lg: 'px-8 py-3.5 text-base rounded',
    };

    const buttonClasses = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const MotionButton = animate ? motion.button : 'button';

    const motionProps: HTMLMotionProps<'button'> = animate
      ? {
          whileHover: disabled || loading ? undefined : { y: -2 },
          whileTap: disabled || loading ? undefined : { scale: 0.98 },
        }
      : {};

    return (
      <MotionButton
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...motionProps}
        {...props}
      >
        {loading ? (
          <>
            <span className="animate-pulse">⚙</span>
            <span className="uppercase tracking-wide">Processing...</span>
          </>
        ) : (
          children
        )}
      </MotionButton>
    );
  }
);

BrutalistButton.displayName = 'BrutalistButton';

export { BrutalistButton };
export type { BrutalistButtonProps, ButtonVariant, ButtonSize };
