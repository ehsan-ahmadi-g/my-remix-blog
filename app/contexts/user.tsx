import React from "react";

import type { User } from "@prisma/client";

type UserStateProviderProps = { children: React.ReactNode };

const UserContext = React.createContext<
  | readonly [
      User | null,
      React.Dispatch<React.SetStateAction<User | null>>,
      () => void
    ]
  | undefined
>(undefined);

function UserProvider({ children }: UserStateProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);

  const logout = () => {
    // Cookies.remove("token");
    setUser(null);
  };

  const value = [user, setUser, logout] as const;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export { UserProvider, useUser };
