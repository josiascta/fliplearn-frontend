import { Link } from "react-router";

interface LinkMenuProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export default function LinkMenu({
  to,
  className = "",
  children,
}: LinkMenuProps) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
