import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Header.css";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="logo">
        <h1>Admin Dashboard</h1>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/admin/project">Projects</Link>
          </li>
          <li>
            <Link to="/admin/skills">Skills</Link>
          </li>
          <li>
            <Link to="/admin/resume">Resume</Link>
          </li>
          <li>
            <Link to="/admin/tool">Tools</Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;