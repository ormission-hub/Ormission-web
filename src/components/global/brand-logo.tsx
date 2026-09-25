"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import brandLogoImg from "../../../public/images/brand-logo-v2.png";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
}

export function BrandLogo({
  className,
  size = "md",
  showTagline = false,
  href = "/",
}: BrandLogoProps) {
  const iconSizes = {
    sm: { width: 32, height: 32, class: "w-8 h-8" },
    md: { width: 40, height: 40, class: "w-10 h-10" },
    lg: { width: 52, height: 52, class: "w-13 h-13" },
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden shadow-xs border border-blue-600/30",
          "bg-[#012c94] flex items-center justify-center shrink-0",
          "group-hover:border-blue-500 group-hover:shadow-md group-hover:shadow-blue-600/25 transition-all duration-300",
          iconSizes[size].class
        )}
      >
        <Image
          src={brandLogoImg}
          alt="Ormission Logo"
          width={iconSizes[size].width}
          height={iconSizes[size].height}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center">
          <span
            className={cn(
              "font-black tracking-tight uppercase text-primary transition-colors",
              textSizes[size]
            )}
          >
            ORMISSION
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-text-muted font-medium tracking-wide -mt-0.5">
            Learn · Build · Grow
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Ormission Home">
        {content}
      </Link>
    );
  }

  return content;
}
