import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Set default headers for all axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Verify token validity by making a request to a protected endpoint
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/auth/verify-token`);
        
        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid or expired
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        // If there's an error (like 401 Unauthorized), clear the token
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};