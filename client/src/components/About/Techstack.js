import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";


function Techstack() {
  const [iconsData, setIconsData] = useState([]);

  useEffect(() => {
    const fetchIconData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/skills`); // Fetch icon data from backend
        setIconsData(response.data); // Set fetched icon data to state
      } catch (error) {
        console.error("Error fetching icon data:", error);
      }
    };

    fetchIconData();
  }, []);

  // Function to get the correct icon component based on iconName
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

      default:
        IconComponent = require("react-icons/di")["DiReact"]; // Fallback icon
        break;
    }

    return IconComponent;
  };


  // Map over iconsData to create the array of icon objects
  const icons = iconsData.map((iconData, index) => {
    // Get the icon component dynamically
    const IconComponent = getIconComponent(iconData.iconName);
    return {
      component: IconComponent,
      name: iconData.name
    };
  });

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {/* Mapping over the icons array to render each icon dynamically */}
      {icons.map((icon, index) => (
        <Col key={index} xs={4} md={2} className="tech-icons">
          {/* Conditionally render the icon component if it exists */}
          {icon.component ? <icon.component /> : null}
        </Col>
      ))}
    </Row>
  );
}

export default Techstack;
