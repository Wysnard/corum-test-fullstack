import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LoginUser } from "@corum/dto";

export type AuthContext = {
  login: (user: LoginUser) => Promise<void>;
  logout: () => void;
  token: string | null;
};

const AuthContext = createContext<AuthContext>({
  login: () => Promise.resolve(),
  logout: () => {},
  token: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const { mutateAsync: login } = useMutation({
    mutationFn: (user: LoginUser) =>
      fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      setToken(data.token);
    },
  });

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
