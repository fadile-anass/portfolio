import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import * as DiIcons from "react-icons/di"; // Import all icons from react-icons/di

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

  // Map over iconsData to create the array of icon objects
  const icons = iconsData.map((iconData, index) => {
    // Ensure the component exists in DiIcons
    const IconComponent = DiIcons[iconData.iconName];
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
