"use client";

import { LucideIcon } from "lucide-react";
import { usePathname, Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/utils/utils";
import { useSession } from "next-auth/react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    allowedTo: string[];
  }[];
}) {
  // Hooks
  const { data } = useSession();
  const pathname = usePathname();

  //  Variables
  const navs = (
    <SidebarMenu className="w-full">
      {items.map((item) => {
        if (item.allowedTo.includes(data?.user.role!)) {
          return (
            <Link href={item.url} key={item.title} className="mb-2">
              <SidebarMenuItem className=" w-full flex justify-center ">
                <SidebarMenuButton
                  tooltip={item.title}
                  className={cn(
                    " w-full cursor-pointer  m-0 transition-colors rounded-md hover:bg-primary-50",
                    pathname.endsWith(item.title.toLowerCase()) &&
                      "bg-primary-200!",
                  )}
                >
                  {item.icon && (
                    <item.icon className="w-5! pr-1 h-5! text-gray-600" />
                  )}
                  <span className="text-[13px]">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          );
        }
      })}
    </SidebarMenu>
  );

  return (
    <SidebarGroup className="w-full">
      <SidebarGroupContent className="flex w-full flex-col gap-2">
        {navs}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
