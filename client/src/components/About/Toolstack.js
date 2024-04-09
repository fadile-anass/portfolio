import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import * as DiIcons from "react-icons/di";
import axios from 'axios';

function Toolstack() {
  const [iconsData, setIconsData] = useState([]);

  useEffect(() => {
    const fetchIconData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/tool"); // Fetch icon data from backend
        setIconsData(response.data); // Set fetched icon data to state
      } catch (error) {
        console.error("Error fetching icon data:", error);
      }
    };

    fetchIconData();
  }, []);

  // Map over iconsData to create the array of icon objects
  const icons = iconsData.map((iconData, index) => ({
    component: DiIcons[iconData.toolIcon], // Access the appropriate icon component from DiIcons
    name: iconData.name
  }));

  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      {icons.map((icon, index)=>(

        <Col key={index} xs={4} md={2} className="tech-icons">
        <icon.component />
      </Col>
        ))}
    </Row>
  );
}

export default Toolstack;
