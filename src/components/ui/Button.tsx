"use client";

import React, { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "liquid";
  size?: "sm" | "md" | "lg" | "xl";
  showArrow?: boolean;
  blur?: "none" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      size = "md",
      showArrow = false,
      blur = "md",
      fullWidth = false,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isSolid = variant === "solid";

    /**
     * Configuration for sizing and spacing.
     * Maintains exact desktop dimensions while ensuring mobile scaling.
     */
    const sizeConfig = {
      sm: {
        dimensions: "h-10 text-xs",
        padding: showArrow ? "pl-4 pr-12" : "px-6",
        iconContainer: "h-[32px] w-[32px]",
        iconSize: 14,
      },
      md: {
        dimensions: "h-12 text-sm",
        padding: showArrow ? "pl-6 pr-14" : "px-8",
        iconContainer: "h-[40px] w-[40px]",
        iconSize: 18,
      },
      lg: {
        dimensions: "h-14 text-base",
        padding: showArrow ? "pl-8 pr-16" : "px-10",
        iconContainer: "h-[48px] w-[48px]",
        iconSize: 20,
      },
      xl: {
        dimensions: "h-16 text-lg",
        padding: showArrow ? "pl-10 pr-20" : "px-12",
        iconContainer: "h-[56px] w-[56px]",
        iconSize: 22,
      },
    };

    const blurStyles = {
      none: "",
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
    };

    const currentSize = sizeConfig[size];

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "group relative inline-flex items-center whitespace-normal leading-[1.1]! nohemi font-light! justify-between rounded-full transition-all duration-500",
          "font-semibold tracking-wide active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none",
          
          currentSize.dimensions,
          currentSize.padding,

          isSolid 
            ? "bg-[#fffef1] text-black hover:bg-white" 
            : [
                "bg-[#fffef1]/10 border-[0.5px] border-[#fffef1]/20 text-[#fffef1] hover:bg-[#fffef1]/15",
                blurStyles[blur],
              ],

          fullWidth ? "w-full" : "w-auto",
          className
        )}
        {...props}
      >
        <span className="relative z-10 whitespace-nowrap">
          {children}
        </span>

        {showArrow && (
          <div
            className={cn(
              "absolute right-1 top-1/2 -translate-y-1/2",
              "flex items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
              currentSize.iconContainer,
              isSolid 
                ? "bg-black text-[#fffef1] group-hover:bg-zinc-900" 
                : "border border-[#fffef1]/30 bg-[#fffef1]/5 text-[#fffef1] group-hover:bg-[#fffef1]/10"
            )}
          >
            <ArrowRight
              size={currentSize.iconSize}
              strokeWidth={2.5}
              className="transition-transform origin-center duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;