import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Axios from "axios";
import chatify from "../../Assets/Projects/chatify.png"; // Import default project image

function Projects() {
  const [projects, setProjects] = useState([]); // State to hold projects data

  useEffect(() => {
    // Fetch projects data when the component mounts
    showProjects();
  }, []);

  const showProjects = () => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URI}/projects`)
      .then((response) => {
        setProjects(response.data); // Update projects state with data from the server
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {projects.map((project) => (
            <Col key={project.id} md={4} className="project-card">
              <ProjectCard
                imgPath={project.image ? `data:image/jpeg;base64,${project.image}` : chatify} // Use a default image path if project.image doesn't exist
                isBlog={false}
                title={project.title}
                description={project.description}
                ghLink={project.ghLink}
                // If demoLink exists, pass it as a prop; otherwise, don't include it

              />
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
