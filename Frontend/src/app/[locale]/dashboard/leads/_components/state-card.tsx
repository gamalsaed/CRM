import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type Variant = "success" | "error";

interface StatCardProps {
  variant: Variant;
  count: number;
  label: string;
}

const variantStyles = {
  success: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    label: "text-emerald-700",
  },
  error: {
    bg: "bg-red-50",
    icon: "text-red-600",
    label: "text-red-700",
  },
};

export default function StatCard({ variant, count, label }: StatCardProps) {
  const styles = variantStyles[variant];
  const Icon = variant === "success" ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`flex-1 rounded-2xl ${styles.bg} p-5`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${styles.icon}`} strokeWidth={2} />
        <span className="text-2xl font-bold text-gray-900">{count}</span>
      </div>
      <p className={`mt-1 font-mono text-sm ${styles.label}`}>{label}</p>
    </div>
  );
}
