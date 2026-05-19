"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import UserInfo from "./user-info";
import { Link } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, UserRoundCog } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/shared/lib/utils/utils";

export default function ProfileDropDown() {
  const [isOpen, onOpen] = useState(false);
  return (
    <DropdownMenu onOpenChange={onOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="h-fit">
          <UserInfo env="header" isInfoVisiable={false} nameIsVis />
          <ChevronDown
            className={cn(
              isOpen && "rotate-180",
              "transition-all duration-200 ease-in-out",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className=" w-fit rounded-xl">
        <DropdownMenuGroup className="bg-gray-50 px-3 py-2">
          <DropdownMenuLabel>
            <UserInfo env="sidebar" isInfoVisiable nameIsVis={false} />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link
            href="#"
            className="px-4 py-2.5 my-1 flex gap-2 cursor-pointer text-sm text-gray-700 hover:bg-primary-50! hover:text-primary-800!"
          >
            <UserRoundCog width={16} height={16} />
            <span>Edit Proeifle</span>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <div className="px-4 py-2.5 my-1 hover:bg-red-50 transition-colors duration-200 cursor-pointer">
            <div
              onClick={() => signOut()}
              className={cn(
                "flex justify-start items-center  gap-2  text-red-600 ",
              )}
            >
              <LogOut className="w-4 h-4 " />
              <span>Sign Out</span>
            </div>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
