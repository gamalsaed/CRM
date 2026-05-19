"use client";
import { useSession } from "next-auth/react";
import stc from "string-to-color";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Layers, Users, Headset } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/shared/lib/utils/utils";
import UserInfo from "./user-info";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import Image from "next/image";
import { ROLES } from "@/shared/lib/constanct";
const data = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    allowedTo: ROLES,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: Layers,
    allowedTo: ROLES,
  },
  {
    title: "Employees",
    url: "/dashboard/employees",
    icon: Users,
    allowedTo: ROLES.slice(0, 1),
  },
  {
    title: "Leads",
    url: "/dashboard/leads",
    icon: Headset,
    allowedTo: ROLES,
  },
];

export default function AppSidebar() {
  // Hooks
  const { data: session } = useSession();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-white!">
        <SidebarMenu>
          <SidebarMenuItem className="w-full flex justify-center">
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent">
              <Image src="/assets/logo.svg" width={40} height={40} alt="LOGO" />
              <h1 className="text-xl font-extrabold">G-CRM</h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Sidebar Body */}
      <SidebarContent className="w-full bg-white">
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {session?.user && (
                <SidebarMenuItem>
                  <UserInfo
                    env="sidebar"
                    isInfoVisiable={state !== "collapsed"}
                  />
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <div
                  onClick={() => signOut()}
                  className={cn(
                    "flex justify-center mt-3 cursor-pointer gap-2 py-1.5  rounded-lg  text-red-600 hover:bg-red-50 transition-colors duration-200",
                    state !== "collapsed" && "border border-red-200",
                  )}
                >
                  <LogOut className="w-4 h-4 " />
                  {state !== "collapsed" && <span>Sign Out</span>}
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
