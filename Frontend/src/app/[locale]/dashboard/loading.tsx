import React from "react";

export default function loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <span className="relative flex h-10 w-10">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-10 w-10 bg-primary-500"></span>
      </span>
    </div>
  );
}
