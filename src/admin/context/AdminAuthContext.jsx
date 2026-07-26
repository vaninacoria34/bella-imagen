import { createContext, useContext, useMemo, useState, useCallback } from "react";

export const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

const SIMULATED_EMAIL = "admin@bellaimagen.com";
const STORAGE_KEY = "adminSimulatedAuth";

function getStoredUser() {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored === "true") {
    return { email: SIMULATED_EMAIL };
  }
  return null;
}

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const signIn = useCallback(async ({ email, password }) => {
    // Simulación: en el futuro se reemplaza por Firebase
    if (email === "admin@bellaimagen.com" && password === "Bella2026!") {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUser({ email: SIMULATED_EMAIL });
      return;
    }
    throw new Error("Credenciales incorrectas");
  }, []);

  const signOut = useCallback(async () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => {
    return {
      user,
      loading: false,
      signIn,
      signOut,
    };
  }, [user, signIn, signOut]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

