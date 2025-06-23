import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProfessorMenu from './pages/ProfessorMenu';
import CriarTurma from './pages/CriarTurma';
import Perfil from './pages/Perfil';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/menu-professor" element={<ProfessorMenu />} />
        <Route path="/create-class" element={<CriarTurma />} />
         <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}
