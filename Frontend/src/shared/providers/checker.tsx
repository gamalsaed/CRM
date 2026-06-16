// 1- Check if the token not expired
// 2- Check if the user said remember me

"use client";

import React, { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
function isTokenExpired(expires: string | undefined) {
  if (!expires) return;
  const expiresDate = new Date(expires).getTime();
  console.log(expiresDate < Date.now());
  //   const result = new Date(expires).getTime() <= Date.now();
  //   return !result;
}

export default function Checker({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const pathname = usePathname();

  isTokenExpired(data?.expires);
  useEffect(() => {
    // if (!isTokenExpired(data?.expires)) {
    //   signOut();
    // }
  }, []);

  return children;
}
