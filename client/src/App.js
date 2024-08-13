import React from 'react';
import Client from './Client';
import  Admin  from './components/Admin/Admin';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Project from './components/Admin/Project/list/Project';
import TestAxios from './TestAxios';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/*" element={<Client />} />
        <Route path="/test" element={<TestAxios />} />
      </Routes>
    </Router>
  );
};
export default App
