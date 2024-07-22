import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import * as DiIcons from "react-icons/di";
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

  const icons = iconsData.map((iconData, index) => {
    const IconComponent = DiIcons[iconData.toolIcon];
    return {
      component: IconComponent || DiIcons.DiReact, // Fallback icon if not found
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
