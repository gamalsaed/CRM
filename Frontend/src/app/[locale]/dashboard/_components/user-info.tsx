"use client";
import { useSession } from "next-auth/react";
import { cn } from "@/shared/lib/utils/utils";
import stc from "string-to-color";

export default function UserInfo({
  nameIsVis = false,
  isInfoVisiable,
  env,
}: {
  isInfoVisiable: boolean;
  env: "header" | "sidebar";
  nameIsVis?: boolean;
}) {
  // Hooks
  const { data: session } = useSession();
  // Variables
  const color = stc(session?.user.email);
  const name = session?.user.name.split(" ")[0];
  const size = env === "sidebar" ? "w-9 h-9 text-xl" : "w-7 h-7 text-base";
  return (
    <div className="overflow-hidden flex items-center gap-3">
      {" "}
      <div
        style={{ backgroundColor: color }}
        className={cn(
          "text-primary-800/40 flex items-center justify-center font-extrabold  rounded-full",
          size,
        )}
      >
        {session?.user && name![0]}{" "}
      </div>
      {nameIsVis && <span className="text-gray-900">{name}</span>}
      {isInfoVisiable && (
        <div className="flex flex-col">
          <span className="text-gray-900">{name}</span>
          <span className="w-full text-gray-400">{session?.user.email}</span>
        </div>
      )}
    </div>
  );
}
