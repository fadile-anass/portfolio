import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from 'axios';

function Toolstack() {
  const [iconsData, setIconsData] = useState([]);

  useEffect(() => {
    const fetchIconData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/tool`);
        setIconsData(response.data);
      } catch (error) {
        console.error("Error fetching icon data:", error);
      }
    };

    fetchIconData();
  }, []);

  const getIconComponent = (iconName) => {
    const iconLibrary = iconName.slice(0, 2); // Extract the library prefix (e.g., 'Di', 'Fa', etc.)
    let IconComponent;

    switch (iconLibrary) {
      case "Di":
        IconComponent = require("react-icons/di")[iconName];
        break;
      case "Fa":
        IconComponent = require("react-icons/fa")[iconName];
        break;
      case "Ai":
        IconComponent = require("react-icons/ai")[iconName];
        break;
      case "Gi":
        IconComponent = require("react-icons/gi")[iconName];
        break;
      case "Io":
        IconComponent = require("react-icons/io")[iconName];
        break;
      case "Si":
        IconComponent = require("react-icons/si")[iconName];
        break;
      case "tb":
        IconComponent = require("react-icons/tb")[iconName];
        break;

      default:
        IconComponent = require("react-icons/di")["DiReact"]; // Fallback icon
        break;
    }

    return IconComponent;
  };

  const icons = iconsData.map((iconData, index) => {
    const IconComponent = getIconComponent(iconData.toolIcon);
    return {
      component: IconComponent || getIconComponent("DiReact"), // Fallback icon if not found
      name: iconData.name
    };
  });

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {icons.map((icon, index) => (
        <Col key={index} xs={4} md={2} className="tech-icons">
          <icon.component />
        </Col>
      ))}
    </Row>
  );
}

export default Toolstack;
