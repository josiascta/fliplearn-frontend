export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white"></i>
              </div>
              <h3 className="text-xl font-bold">Fliplearn</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Transformando a educação através da inteligência artificial e
              metodologias ativas.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Para Professores
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Para Alunos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Recursos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contato
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tutoriais
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Conecte-se</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <i className="fab fa-twitter text-sm"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer"
              >
                <i className="fab fa-linkedin-in text-sm"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors cursor-pointer"
              >
                <i className="fab fa-instagram text-sm"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Fliplearn. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
