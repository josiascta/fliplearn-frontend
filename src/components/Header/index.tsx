import { useNavigate } from "react-router-dom";
import { usePerfil } from "../../hooks/usePerfil";

export function Header() {
  const navigate = useNavigate();
  const { perfil } = usePerfil();

  const handleClickPerfil = () => {
    navigate("/perfil");
  };

  return (
    <header className=" bg-white shadow-lg z-50 border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-graduation-cap text-white text-lg"></i>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fliplearn
            </h1>
          </div>
          {perfil && (
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={handleClickPerfil}
                className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer"
              >
                <i className="fas fa-user text-white"></i>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
