"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

export default function LanguageDropDown() {
  // Hooks
  const [isOpen, onOpen] = useState(false);
  const pathname = usePathname();

  // Vaariables
  const local = pathname.split("/")[1];
  const country = local === "en" ? "US" : local === "ar" && "EG";
  const currentPath = `/${pathname.split("/").slice(2).join("/")}`;
  return (
    <DropdownMenu onOpenChange={onOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-fit">
          <div
            className={cn(
              "text-primary-800/40  w-7 h-7 text-sm bg-white flex items-center justify-center font-extrabold rounded-full",
            )}
          >
            {country}
          </div>
          <ChevronDown
            className={cn(
              isOpen && "rotate-180",
              "transition-all duration-200 ease-in-out",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" w-48 py-1 rounded-xl">
        <DropdownMenuGroup>
          <Link
            href={currentPath}
            locale="en"
            className="cursor-pointer p-2 text-[12px] transition-colors duration-200 hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <span className="mr-2">US</span>
              <span className="text-gray-400">Egnlish</span>
            </div>
            {country === "US" && (
              <Check className="text-primary-800" width={16} height={16} />
            )}
          </Link>
          <Link
            href={currentPath}
            locale="ar"
            className="cursor-pointer p-2 text-[12px] transition-colors duration-200 hover:bg-gray-50 flex justify-between items-center"
          >
            <div>
              <span className="mr-2">EG</span>
              <span className="text-gray-400">العربية</span>
            </div>
            {country === "EG" && <Check className="text-primary-800" />}
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
