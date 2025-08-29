import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl"
};

export default function Logo({
  size = "lg",
  className,
  showText = true,
  textClassName
}: LogoProps) {
  return (
    <div className="flex items-center">
      <img
        src="/bettertaxai-logo.svg"
        alt="BETTERTAXAI Logo"
        className={cn(
          sizeClasses[size],
          "object-contain",
          showText && "mr-3",
          className
        )}
      />
      {showText && (
        <span
          className={cn(
            "font-bold text-gray-900",
            textSizeClasses[size],
            textClassName
          )}
        >
          BETTERTAXAI
        </span>
      )}
    </div>
  );
}
