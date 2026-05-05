import React from "react";
import AdvSide from "./_components/adv";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-full flex">
      <AdvSide />
      <div className="flex-1">{children}</div>
    </div>
  );
}
