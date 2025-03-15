import React from 'react';
import Client from './Client';
import Admin from './components/Admin/Admin';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TestAxios from './TestAxios';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<TestAxios />} />
          <Route path="/*" element={<Client />} />
          
          {/* Protected admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;