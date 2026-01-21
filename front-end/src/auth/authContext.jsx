import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    console.log("User", JSON.parse(storedUser));
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(false);
    localStorage.removeItem("userData");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(UserContext);
