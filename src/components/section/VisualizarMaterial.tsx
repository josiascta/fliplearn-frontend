

type Material = {
  id: number;
  titulo: string;
  link: string;
};

export const VisualizarMaterial = ({ material }: { material: Material }) => {
  const fileId = material.link.split("/d/")[1]?.split("/")[0];

  return (
    <div>
      <h3>{material.titulo}</h3>
      {fileId ? (
        <iframe
          src={`https://drive.google.com/file/d/${fileId}/preview`}
          width="100%"
          height="600"
          allow="autoplay"
          style={{ border: "none" }}
        />
      ) : (
        <p>Link inválido</p>
      )}
    </div>
  );
};
