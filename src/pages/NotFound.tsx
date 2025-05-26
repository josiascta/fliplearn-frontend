export function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-gray-100 font-semibold text-2xl mb-10">Página não disponível 😢</h1>
        <a className="font-semibold text-center text-blue-200 hover:text-blue-300 transition ease-linear" href="/">Voltar para o início</a>
      </div>
    </div>
  );
}
