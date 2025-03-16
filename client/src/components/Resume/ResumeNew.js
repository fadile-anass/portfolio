import React, { useState, useEffect } from "react";
import { Container, Row, Spinner, Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import axios from "axios";
import defaultPdf from "../../Assets/FADILE_ANASS.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingDefaultResume, setUsingDefaultResume] = useState(false);

  useEffect(() => {
    setWidth(window.innerWidth);
    
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI || ""}/resume`);
        if (response.data && response.data.length > 0) {
          // Get the first resume (since we're only allowing one)
          const resume = response.data[0];
          
          // Check if we have a file path or binary data
          let pdfUrl;
          if (resume.pdf && resume.pdf.data) {
            // Convert Buffer data to string to get the file path
            const filePath = bufferToString(resume.pdf.data);
            
            // Create a URL to the PDF file on the server
            pdfUrl = `${process.env.REACT_APP_BACKEND_URI || ""}/uploads/${filePath.split('\\').pop()}`;
          }
          
          setResumeData({
            name: resume.name || "Resume",
            link: resume.link || "",
            pdfData: pdfUrl || defaultPdf
          });
        } else {
          // Use default resume if none found in database
          setUsingDefaultResume(true);
          setResumeData({
            name: "FADILE_ANASS",
            link: defaultPdf,
            pdfData: defaultPdf
          });
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        // Use default resume on error
        setUsingDefaultResume(true);
        setResumeData({
          name: "FADILE_ANASS",
          link: defaultPdf,
          pdfData: defaultPdf
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  // Helper function to convert buffer to string
  const bufferToString = (buffer) => {
    return String.fromCharCode.apply(null, buffer);
  };

  // Helper function to convert array buffer to base64 (kept for reference)
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Loading resume...</p>
          </div>
        ) : resumeData ? (
          <>
            {usingDefaultResume && (
              <Alert variant="info" className="text-center mb-4">
                Using default resume. No custom resume found in database.
              </Alert>
            )}
            
            <Row style={{ justifyContent: "center", position: "relative" }}>
              <Button
                variant="primary"
                href={resumeData.pdfData}
                target="_blank"
                download={`${resumeData.name}.pdf`}
                style={{ maxWidth: "250px" }}
              >
                <AiOutlineDownload />
                &nbsp;Download CV
              </Button>
            </Row>

            <Row className="resume">
              <Document 
                file={resumeData.pdfData} 
                className="d-flex justify-content-center"
                loading={
                  <div className="text-center my-3">
                    <Spinner animation="border" variant="primary" size="sm" />
                    <p>Loading PDF...</p>
                  </div>
                }
                error={
                  <div className="text-center my-3">
                    <Alert variant="danger">Failed to load PDF</Alert>
                  </div>
                }
              >
                <Page pageNumber={1} scale={width > 786 ? 1.7 : 0.6} />
              </Document>
            </Row>

            <Row style={{ justifyContent: "center", position: "relative" }}>
              <Button
                variant="primary"
                href={resumeData.pdfData}
                target="_blank"
                download={`${resumeData.name}.pdf`}
                style={{ maxWidth: "250px" }}
              >
                <AiOutlineDownload />
                &nbsp;Download CV
              </Button>
            </Row>
          </>
        ) : (
          <Alert variant="danger" className="text-center">
            Failed to load any resume
          </Alert>
        )}
      </Container>
    </div>
  );
}

export default ResumeNew;