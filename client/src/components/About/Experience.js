import React from "react";
import { Container, Row, Col, Card, Carousel } from "react-bootstrap";

function Experience() {
  const experiences = [
    {
      company: "IS-Tech",
      position: "Full Stack Developer Intern",
      duration: "10/2024 - Present",
      description: `
        Developed a travel agency dashboard for managing trips and clients using Vue.js.
        Built a web application for event management with Laravel and Vue.js.
      `
    },
    {
      company: "Croissant Rouge Marocain",
      position: "Full Stack Developer Intern",
      duration: "04/2024 - 07/2024",
      description: `
        Developed an Integrated Management System for a training center using the MERN stack (MongoDB, Express, React, Node.js).
      `
    },
    {
      company: "INSTALLATION ELECTRIQUE",
      position: "Front-End Developer Intern",
      duration: "11/2023 - 01/2024",
      description: `
        Designed and implemented e-commerce website interfaces using the Laravel framework.
      `
    },
    {
      company: "Ancona Media",
      position: "Web Developer Intern",
      duration: "05/2023 - 06/2023",
      description: `
        Developed an event management website with Laravel framework.
      `
    }
  ];
return (
    <Container fluid className="experience-section py-5">
      <Container>
        <h1 className="project-heading text-center mb-5">
          My <strong className="purple">Experience</strong> 🚀
        </h1>
        <Carousel interval={5000} indicators={false}>
          {experiences.map((exp, index) => (
            <Carousel.Item key={index}>
              <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                  <Card className="experience-card">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="mb-2 fs-5">
                        {exp.position}
                      </Card.Title>
                      <Card.Subtitle className="mb-3 purple fs-6">
                        {exp.company} | <span>{exp.duration}</span>
                      </Card.Subtitle>
                      <Card.Text className="fs-6 flex-grow-1" style={{ textAlign: "justify", overflowY: "auto" }}>
                        {exp.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </Container>
  );
}

export default Experience;