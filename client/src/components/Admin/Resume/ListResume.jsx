import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { Document, Page, pdfjs } from "react-pdf"; // Import Document and Page from react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


const ListResume = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    showResumes();
  }, []);

  const showResumes = () => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URI}/resume`)
      .then((response) => {
        setResumes(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = (resumeId) => {
    Axios.delete(`${process.env.REACT_APP_BACKEND_URI}/resume/delete/${resumeId}`)
      .then((response) => {
        console.log("ListResume deleted successfully");
        setResumes(resumes.filter(resume => resume.id !== resumeId));
        showResumes();
      })
      .catch((error) => {
        console.error("Error deleting ListResume:", error);
      });
  };


  const handlePdfClick = (pdfUrl) => {
    console.log(pdfUrl)
    
    setSelectedPdf(pdfUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPdf(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-primary" onClick={showResumes}>
            Refresh
          </button>
          <Link className="btn btn-primary" to="/admin/resume/add">
            Add
          </Link>
        </div>

        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">name</th>
              <th scope="col">Link</th>
              <th scope="col">Image</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.id}</td>
                <td>{resume.name}</td>
                <td>
                  {/* Check if link is available */}

              
                    <a
                      href={resume.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Link
                    </a>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handlePdfClick(resume.pdf)}
                  >
                    View PDF
                  </button>
                </td>
                <td>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic checkbox toggle button group"
                  >
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(resume.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Document file={selectedPdf} onError={(error) => console.error('Error loading PDF:', error)}>
            <Page pageNumber={1} />
          </Document>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ListResume;
