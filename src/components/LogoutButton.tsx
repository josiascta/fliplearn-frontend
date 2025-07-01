import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

interface LogoutButtonProps {
  logout: () => void;
}

export function LogoutButton({ logout }: LogoutButtonProps) {
  const navigate = useNavigate();

  const handleClick = (): void => {
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleClick}
      className="
        flex items-center gap-2 px-4 py-2
        bg-red-700/60 text-white font-medium rounded-md
        hover:bg-red-800/30 active:bg-red-700/60
        transition-colors
      "
    >
      <LogOut size={17} strokeWidth={2.5} />
    </button>
  );
}
