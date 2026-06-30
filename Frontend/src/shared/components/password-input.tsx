"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "../lib/utils/utils";
import { Eye, EyeOff } from "lucide-react";

/**
 * Password input with a visibility toggle. Accepts all standard input
 * attributes and an optional `error` flag to apply destructive border styling.
 */
export default function PasswordInput({
  placeholder,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  // State
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        className={cn("pr-10", error && "border-destructive")}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
