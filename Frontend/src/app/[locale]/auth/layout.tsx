import React from "react";
import AdvSide from "./_components/adv";

/**
 * Auth layout. Renders a two-column view: a decorative marketing panel on
 * the left (hidden on mobile) and the auth page content on the right.
 */
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-full flex">
      <AdvSide />
      <div className="flex-1">{children}</div>
    </div>
  );
}
