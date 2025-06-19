
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 w-full active:scale-[0.97] shadow-sm border-0 min-h-[52px]",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 shadow-blue-100",
        destructive: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-red-100",
        outline: "border border-gray-200 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 shadow-gray-100 text-gray-900",
        secondary: "bg-gray-50 text-gray-900 hover:bg-gray-100 active:bg-gray-200 shadow-gray-100 border border-gray-200",
        ghost: "hover:bg-gray-100 active:bg-gray-200 shadow-none text-gray-900",
        link: "text-blue-500 underline-offset-4 hover:underline shadow-none w-auto font-medium",
      },
      size: {
        default: "h-[52px] px-8 py-4",
        sm: "h-[48px] rounded-3xl px-6 py-3 text-sm",
        lg: "h-[56px] rounded-3xl px-10 py-5 text-lg font-medium",
        icon: "h-[52px] w-[52px] rounded-full",
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
