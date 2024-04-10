import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import Axios from "axios";
// import pdf from "../../Assets/../Assets/af.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [resume, setResume] = useState([]); // State to hold projects data

  const [width, setWidth] = useState(1200);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    // Fetch projects data when the component mounts
    showResume();
  }, []);

  const showResume = () => {
    Axios.get("https://portfolio-xqtv.onrender.com/resume")
      .then((response) => {
        setResume(response.data); // Update projects state with data from the server
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        {resume.map((resume)=>(
          <div key={resume.id}>
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={resume.Link}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
        </Row>

        <Row className="resume">
          <Document file={resume.pdf} className="d-flex justify-content-center">
            <Page pageNumber={1} scale={width > 786 ? 1.7 : 0.6} />
          </Document>
        </Row>

        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={resume.Link}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
        </Row>
        </div>
        ))}
      </Container>
    </div>
  );
}

export default ResumeNew;
