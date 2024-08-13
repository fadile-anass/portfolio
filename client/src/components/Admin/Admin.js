import React from "react";
import "./Admin.css";
import Project from "./Project/list/Project";
import { Addproject } from "./Project/Addproject/Addproject";
import Skills from "./Skills/Skills";
import AddSkills from "./Skills/AddSkills";
import Header from "./layout/Header";
import { Route, Routes } from "react-router-dom";
import Updateproject from "./Project/Updateproject/Updateproject";
import ListResume from "./Resume/ListResume";
import AddResume from "./Resume/AddResume";
import Tool from "./Tool/Tool";
import AddTool from "./Tool/AddTool";

const Admin = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/project/*" element={<ProjectRoutes />} />
        <Route path="/resume/*" element={<ResumeRoutes />} />
        <Route path="/skills/*" element={<SkillsRouts />} />
        <Route path="/tool/*" element={<ToolRouts />} />
      </Routes>
    </>
  );
};
// Nested component to handle project routes

const ProjectRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Project />} />
      <Route path="/add" element={<Addproject />} />
      <Route path="/update/:id" element={<Updateproject />} />
    </Routes>
  );
};
// Nested component to handle resume routes

const ResumeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ListResume />} />
      <Route path="/add" element={<AddResume />} />
    </Routes>
  );
};
// Nested component to handle skills routes

const SkillsRouts = () => {
  return (
    <Routes>
      <Route path="/" element={<Skills />} />
      <Route path="/add" element={<AddSkills />} />
    </Routes>
  );
};
// Nested component to handle tool routes

const ToolRouts = () => {
  return (
    <Routes>
      <Route path="/" element={<Tool />} />
      <Route path="/add" element={<AddTool />} />
    </Routes>
  );
};
export default Admin;
