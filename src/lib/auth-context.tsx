import * as React from "react";

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const STORAGE_KEY = "orbita:auth";

const MOCK_USER: AuthUser = {
  id: "U001",
  name: "Roberto Almeida",
  role: "Gerente BU",
  avatar: "RA",
};

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(readStoredUser);

  const login = React.useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
