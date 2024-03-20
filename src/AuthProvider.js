import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
      return localStorage.getItem('isAuthenticated') === 'true';
    });
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {children}
      </AuthContext.Provider>
    );
  };
  

export const useAuth = () => useContext(AuthContext);
