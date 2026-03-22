import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Axios from "axios";
import chatify from "../../Assets/Projects/chatify.png";
import ImageModal from "./ImageModal"; // Import the new ImageModal component

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    showProjects();
  }, []);

  const showProjects = () => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URI}/projects`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
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
                imgPath={project.image ? `data:image/jpeg;base64,${project.image}` : chatify}
                isBlog={false}
                title={project.title}
                description={project.description}
                ghLink={project.ghLink}
                demoLink={project.demoLink}
                onImageClick={() => handleImageClick(project.image ? `data:image/jpeg;base64,${project.image}` : chatify)}
              />
            </Col>
          ))}
        </Row>
      </Container>
      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        imageUrl={selectedImage}
      />
    </Container>
  );
}

export default Projects;