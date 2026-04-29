"use client";

import React, { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "liquid";
  size?: "sm" | "md" | "lg" | "xl"; // Controls Height
  showArrow?: boolean;
  blur?: "none" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "solid", 
    size = "md", 
    showArrow = false, 
    blur = "md", 
    fullWidth = false, 
    children, 
    ...props 
  }, ref) => {
    
    const isSolid = variant === "solid";

    // 1. Size Mapping (Scales Height and Padding)
    const sizeClasses = {
      sm: "h-10 text-xs pl-4 pr-12",
      md: "h-12 text-sm pl-6 pr-14",
      lg: "h-14 text-base pl-8 pr-16",
      xl: "h-16 text-lg pl-10 pr-20",
    };

    // If no arrow is shown, we use symmetrical horizontal padding
    const noArrowPadding = {
      sm: "px-6",
      md: "px-8",
      lg: "px-10",
      xl: "px-12",
    };

    const blurClasses = {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-start rounded-full transition-all duration-300",
          "font-semibold tracking-tight active:scale-95 disabled:opacity-50 select-none outline-none",
          
          // Apply size-based height and padding
          showArrow ? sizeClasses[size] : noArrowPadding[size],

          // Variation Styles
          isSolid ? "bg-[#fffef1] text-black hover:bg-zinc-100" : [
            "bg-[#fffef1]/10 border-[0.5px] border-[#fffef1]/20 text-[#fffef1] hover:bg-[#fffef1]/15",
            blurClasses[blur],
          ],

          fullWidth && "w-full",
          className // User can still pass w-64, h-20, etc. here
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>

        {showArrow && (
          <div 
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2",
              "flex aspect-square h-[90%] items-center justify-center rounded-full transition-colors duration-300",
              isSolid ? "bg-black text-[#fffef1]" : "border border-[#fffef1]/30 bg-[#fffef1]/5 text-[#fffef1]"
            )}
          >
            <ArrowRight 
              size={size === "sm" ? 14 : size === "xl" ? 22 : 18} 
              strokeWidth={2.5} 
              className="transition-all duration-400 ease-out group-hover:-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
            />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "DynamicCapsuleButton";

export default Button;