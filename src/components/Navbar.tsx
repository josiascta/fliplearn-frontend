import { Home, SquareEqual, ChevronUp } from "lucide-react";
import LinkMenu from "./LinkMenu";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

interface Curso {
  id: number;
  nome: string;
  descricao?: string;
  cargaHoraria?: number;
}

export function NavBar() {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  const [cursos, setCursos] = useState<Curso[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8080/cursos/professor/${session?.idUsuario}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
      })
      .then((data: Curso[]) => {
        setCursos(data);
      })
      .catch((err) => console.error("Erro ao buscar cursos:", err));
  }, []);

  return (
    <nav>
      <ul className="flex flex-col gap-4 mt-6 list-none p-0">
        <li>
          <LinkMenu
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-white hover:bg-gray-700 transition-colors"
          >
            <Home size={20} />
            Home
          </LinkMenu>
        </li>
        <li>
          <button
            onClick={toggle}
            className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-white hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <SquareEqual size={20} />
              <p>Inscrições</p>
            </div>

            <div
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            >
              <ChevronUp size={18} />
            </div>
          </button>

          {open && (
            <ul className="mt-2 ml-8 text-sm text-gray-300 space-y-1">
              {cursos.map((curso) => (
                <li key={curso.id}>
                  <LinkMenu
                    className="block max-w-[180px] truncate whitespace-nowrap overflow-hidden"
                    to={`/inscricao/${curso.id}`}
                  >
                    {curso.nome}
                  </LinkMenu>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
}
