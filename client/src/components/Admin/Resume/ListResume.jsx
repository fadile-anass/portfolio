import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Card, Badge, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ListResume = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [selectedResumeName, setSelectedResumeName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    showResumes();
  }, []);

  const showResumes = () => {
    setLoading(true);
    setError(null);
    Axios.get(`${process.env.REACT_APP_BACKEND_URI}/resume`)
      .then((response) => {
        setResumes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to load resumes. Please try again.");
        setLoading(false);
      });
  };

  const handleDelete = (resumeId) => {
    setLoading(true);
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    Axios.delete(`${process.env.REACT_APP_BACKEND_URI}/resume/${resumeId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      
      }
    })
      .then(() => {
        setResumes(resumes.filter(resume => resume.id !== resumeId));
        setDeleteConfirmation(null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error deleting resume:", error);
        setError("Failed to delete resume. Please try again.");
        setLoading(false);
      });
  };


  const handlePdfClick = (pdfData, name) => {
    // Check if pdfData is a Buffer containing a file path
    if (pdfData && pdfData.data) {
      try {
        // First try to interpret as a file path in Buffer format
        const filePath = bufferToString(pdfData.data);
        
        // Check if it looks like a file path
        if (filePath.includes('uploads') || filePath.includes('\\') || filePath.includes('/')) {
          // Extract the filename from the path
          const fileName = filePath.split(/[\\\/]/).pop();
          // Create a URL to the PDF file on the server
          const pdfUrl = `${process.env.REACT_APP_BACKEND_URI}/uploads/${fileName}`;
          
          // Set the URL to fetch the PDF
          setSelectedPdf(pdfUrl);
          setSelectedResumeName(name);
          setPageNumber(1);
          setShowModal(true);
          return;
        }
      } catch (err) {
        console.error("Error processing file path:", err);
      }
      
      // If not a file path or error occurred, try to use as binary data
      try {
        const pdfBase64 = arrayBufferToBase64(pdfData.data);
        setSelectedPdf(`data:application/pdf;base64,${pdfBase64}`);
        setSelectedResumeName(name);
        setPageNumber(1);
        setShowModal(true);
      } catch (err) {
        console.error("Error processing PDF data:", err);
        setError("Failed to load PDF preview. The file may be corrupted.");
      }
    } else {
      setError("No PDF data available for preview.");
    }
  };
  
  // Helper function to convert buffer to string
  const bufferToString = (buffer) => {
    return String.fromCharCode.apply(null, buffer);
  };

  // Helper function to convert array buffer to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleCloseModal = () => {
    setSelectedPdf(null);
    setShowModal(false);
    setNumPages(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const confirmDelete = (resumeId, name) => {
    setDeleteConfirmation({ id: resumeId, name });
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
  <h5 className="mb-0">
    <i className="fas fa-file-pdf me-2"></i>
    Resume Management
  </h5>
  <div>
    <Button 
      variant="light" 
      size="sm" 
      className="me-2" 
      onClick={showResumes}
      disabled={loading}
    >
      <i className="fas fa-sync-alt me-1"></i> Refresh
    </Button>
    {resumes.length === 0 ? (
      <Link to="/admin/resume/add" className="btn btn-light btn-sm">
        <i className="fas fa-plus me-1"></i> Add New
      </Link>
    ) : (
      <Button variant="light" size="sm" disabled title="Only one resume allowed">
        <i className="fas fa-plus me-1"></i> Add New
      </Button>
    )}
  </div>
</Card.Header>
        <Card.Body>
        {error && (
    <Alert variant="danger" onClose={() => setError(null)} dismissible>
      <i className="fas fa-exclamation-triangle me-2"></i>
      {error}
    </Alert>
  )}
  
  {resumes.length > 0 && window.location.pathname === "/admin/resume/add" && (
    <Alert variant="warning">
      <i className="fas fa-exclamation-circle me-2"></i>
      You already have a resume uploaded. Please delete the existing resume before adding a new one.
    </Alert>
  )}

          {loading && !error ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-folder-open text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">No resumes found. Add your first resume!</p>
              <Link to="/admin/resume/add" className="btn btn-primary mt-2">
                <i className="fas fa-plus me-2"></i>
                Add Resume
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col" width="5%">#</th>
                    <th scope="col" width="25%">Name</th>
                    <th scope="col" width="25%">Link</th>
                    <th scope="col" width="20%">PDF</th>
                    <th scope="col" width="25%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map((resume, index) => (
                    <tr key={resume.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{resume.name}</strong>
                      </td>
                      <td>
                        {resume.link ? (
                          <a
                            href={resume.link.startsWith('http') ? resume.link : `https://${resume.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="fas fa-external-link-alt me-1"></i>
                            Visit Link
                          </a>
                        ) : (
                          <Badge bg="secondary">No Link</Badge>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => handlePdfClick(resume.pdf, resume.name)}
                        >
                          <i className="fas fa-file-pdf me-1"></i>
                          Preview
                        </Button>
                      </td>
                      <td>
                        {deleteConfirmation && deleteConfirmation.id === resume.id ? (
                          <div className="d-flex gap-2">
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleDelete(resume.id)}
                            >
                              <i className="fas fa-check me-1"></i> Confirm
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={cancelDelete}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDelete(resume.id, resume.name)}
                          >
                            <i className="fas fa-trash-alt me-1"></i>
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="lg" 
        centered
        contentClassName="pdf-modal"
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="fas fa-file-pdf text-danger me-2"></i>
            {selectedResumeName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-light">
          <div className="pdf-container bg-white p-3 text-center">
            {selectedPdf && (
              <Document 
                file={selectedPdf} 
                onLoadSuccess={onDocumentLoadSuccess}
                onError={(error) => console.error('Error loading PDF:', error)}
                loading={
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Loading PDF...</p>
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  width={Math.min(600, window.innerWidth - 80)}
                />
              </Document>
            )}
          </div>
          {numPages && (
            <div className="d-flex justify-content-between align-items-center p-3 border-top">
              <div>
                Page {pageNumber} of {numPages}
              </div>
              <div className="btn-group">
                <Button 
                  variant="outline-secondary" 
                  onClick={previousPage} 
                  disabled={pageNumber <= 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={nextPage} 
                  disabled={pageNumber >= numPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListResume;