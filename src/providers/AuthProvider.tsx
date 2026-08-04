"use client";

import { createContext, useContext, type ReactNode } from "react";

interface AuthContextValue {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const signOut = async () => {
    const { signOutAction } = await import("@/actions/auth");
    await signOutAction();
  };

  return (
    <AuthContext.Provider value={{ signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
