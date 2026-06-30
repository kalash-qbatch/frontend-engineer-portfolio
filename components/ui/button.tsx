import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_30px_-5px_rgba(250,250,250,0.3)]",
        outline:
          "rounded-xl border border-border bg-surface text-foreground hover:border-border-hover hover:bg-surface-hover",
        ghost: "rounded-lg text-muted hover:text-foreground hover:bg-surface",
        accent:
          "rounded-xl bg-accent text-white hover:shadow-[0_0_30px_-5px_var(--accent-glow)]",
        glass:
          "rounded-xl border border-border bg-surface text-foreground backdrop-blur-md hover:border-border-hover hover:bg-surface-hover",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
