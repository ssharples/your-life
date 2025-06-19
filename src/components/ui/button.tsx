
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full sm:w-auto shadow-lg hover:shadow-xl active:scale-95 min-h-[44px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-blue-200 hover:shadow-blue-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-red-200 hover:shadow-red-300",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-gray-200 hover:shadow-gray-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-gray-200 hover:shadow-gray-300",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-none hover:shadow-lg",
        link: "text-primary underline-offset-4 hover:underline shadow-none w-auto",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-2xl px-4 py-2",
        lg: "h-14 rounded-2xl px-8 py-4",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
