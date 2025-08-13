import { useEffect, useState } from "react";
import axios from "axios";
import { VisualizarMaterial } from "./VisualizarMaterial";

type Material = {
  id: number;
  titulo: string;
  link: string;
};

export const ListaMateriais = () => {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [selecionado, setSelecionado] = useState<Material | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/materiais", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setMateriais(res.data));
  }, []);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{ flex: 1 }}>
        <h2>Materiais Disponíveis</h2>
        <ul>
          {materiais.map((material) => (
            <li key={material.id}>
              <button onClick={() => setSelecionado(material)}>
                {material.titulo}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ flex: 2 }}>
        {selecionado ? (
          <VisualizarMaterial material={selecionado} />
        ) : (
          <p>Selecione um material para visualizar</p>
        )}
      </div>
    </div>
  );
};
