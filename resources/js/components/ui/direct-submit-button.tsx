import * as React from "react";
import { Button } from "./button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DirectSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  loadingText?: string;
  className?: string;
}

/**
 * A button component for form submissions with minimal loading indication
 */
export function DirectSubmitButton({
  children,
  variant = "default",
  size = "default",
  loading = false,
  loadingText,
  className,
  disabled,
  ...props
}: DirectSubmitButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      type="submit"
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {loadingText || children}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}

export default DirectSubmitButton;
