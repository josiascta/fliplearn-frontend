import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <div className="grid grid-cols-[auto_auto_1fr] h-screen">
      <Sidebar open={open} setOpen={setOpen} />

      <main className="p-4 transition-all duration-300 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
