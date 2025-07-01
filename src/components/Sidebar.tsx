import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { NavBar } from "./Navbar";
import { useAuth } from "../hooks/useAuth";
import { LogoutButton } from "./LogoutButton";
import Divider from "@mui/material/Divider";

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const { session, logout } = useAuth();

  return (
    <>
      <div
        className={`h-screen bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col ${
          open ? "w-[240px] p-4" : "w-0"
        }`}
      >
        {open && (
          <div className="flex flex-col h-full">
            <Link
              to="/"
              className="text-2xl font-bold text-white mb-4 no-underline"
            >
              FlipLearn
            </Link>

            <div className="flex flex-col justify-between flex-grow">
              <NavBar />

              <div>
                <Divider
                  sx={{ borderColor: "grey.400", borderWidth: "0.5px" }}
                />
                <div className="flex items-center justify-between gap-3 p-2">
                  <Link
                    to="/perfil"
                    className="flex items-center gap-2 text-white no-underline hover:opacity-80 transition-opacity"
                  >
                    <img
                      src="https://github.com/josiascta.png"
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm">{session?.nome}</span>
                  </Link>

                  <LogoutButton logout={logout} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setOpen(!open);
        }}
        className="h-screen w-6 flex items-center justify-center bg-gradient-to-r from-black/15 to-transparent cursor-pointer transition-all duration-300"
      >
        <div className="text-gray-600 hover:text-gray-400 transition-colors">
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </div>
      </div>
    </>
  );
}
