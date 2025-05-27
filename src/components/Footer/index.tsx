
export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} FlipLearn. Todos os direitos reservados.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-black text-sm">Política de Privacidade</a>
          <a href="#" className="hover:text-black text-sm">Termos de Uso</a>
          <a href="#" className="hover:text-black text-sm">Contato</a>
        </div>
      </div>
    </footer>
  );
}
