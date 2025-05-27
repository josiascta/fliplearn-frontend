import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { Footer } from "../Footer";
import { Header } from "../Header";

export function Layout() {
  const [userName, setUserName] = useState<string | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('nome');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col">
      <Header title="FlipLearn" />

      <main className="flex-grow">
        <Outlet />
      </main>
         

      <Footer />
    </div>
  );
}
