import React from "react";
import { LucideIcon } from "lucide-react";

type AdvProps = {
  children: React.ReactNode;
  Icon: LucideIcon;
  description: string;
};

export default function AdvBox({ children, Icon, description }: AdvProps) {
  return (
    <div className="p-4 bg-[#222222] w-full rounded-2xl border-gray-200">
      <Icon className="text-primary-500 mb-3" />
      <h1 className="font-bold text-xl mb-1">{children}</h1>
      <p className="text-[12px] text-gray-400">{description}</p>
    </div>
  );
}
