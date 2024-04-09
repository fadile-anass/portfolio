import React from "react";
import "./Header.css";
import {  Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header>
        <ul className="nav justify-content-center">
          <li className="nav-item">
          <Link className="nav-link" to="/admin">
              Admin
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/project">
              projects
            </Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/admin/skills">
              Skills
            </Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/admin/resume">
              resume
            </Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/admin/tool">
              Tool
            </Link>
          </li>

        </ul>
      </header>
    </>
  );
};

export default Header;
