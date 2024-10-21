import React from "react";
import "./Header.css";
import {  Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header>
        <ul className="nav justify-content-center">
          <li className="nav-item">
          <Link className="nav-link" to="/240902">
              Admin
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/240902/project">
              projects
            </Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/240902/skills">
              Skills
            </Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/240902/resume">
              resume
            </Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/240902/tool">
              Tool
            </Link>
          </li>

        </ul>
      </header>
    </>
  );
};

export default Header;
