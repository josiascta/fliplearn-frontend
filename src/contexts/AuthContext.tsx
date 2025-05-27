import { createContext, ReactNode, useState } from "react";
import { useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

type AuthContext = {
  session: null | UserAPIResponse
  save: (data: UserAPIResponse) => void
  logout: () => void;
  isLoadingSession: boolean;
} 

export const AuthContext = createContext({} as AuthContext)

export function AuthProvider({children}: {children: ReactNode}){
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [session, setSession] = useState<null | UserAPIResponse>(null)

  function save(data: UserAPIResponse){
    setSession(data)
    localStorage.setItem("user", JSON.stringify(data));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); 

        if (decoded.exp && decoded.exp < currentTime) {
          console.warn("Token expirado. Fazendo logout...");
          logout();
        } else {
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setSession(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Token inválido. Fazendo logout...");
        logout();
      }
    }

    setIsLoadingSession(false);
  }, []);

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setSession(null);
  }

  return (
    <AuthContext.Provider value={ {session, save,logout, isLoadingSession} }>
      {children}
    </AuthContext.Provider>
  )
}