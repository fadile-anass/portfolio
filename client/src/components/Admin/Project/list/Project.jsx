import React, { useState, useEffect } from "react";
import "./Project.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Spinner, Card, Badge } from "react-bootstrap";
import ImageModal from "../../layout/ImageModal";
import { FaGithub, FaEdit, FaTrash, FaEye, FaSync, FaPlus } from "react-icons/fa";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, projectId: null });
  const Navigate = useNavigate();

  useEffect(() => {
    showProjects();
  }, []);

  const showProjects = () => {
    setLoading(true);
    setError(null);
    
    Axios.get(`${process.env.REACT_APP_BACKEND_URI}/projects`)
      .then((response) => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to load projects. Please try again.");
        setLoading(false);
      });
  };

  const confirmDelete = (projectId) => {
    setDeleteConfirmation({ show: true, projectId });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, projectId: null });
  };

  const handleDelete = () => {
    const projectId = deleteConfirmation.projectId;
    const token = localStorage.getItem('token');

    Axios.delete(`${process.env.REACT_APP_BACKEND_URI}/projects/delete/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setProjects(projects.filter(project => project.id !== projectId));
        setDeleteConfirmation({ show: false, projectId: null });
        // Show success notification
        showNotification("Project deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
        // Show error notification
        showNotification("Failed to delete project", "danger");
      });
  };


  const handleModify = (project) => {
    setUpdateData({
      id: project.id,
      title: project.title,
      description: project.description,
      ghLink: project.ghLink,
      image: project.image,
    });
    Navigate(`/admin/project/update/${project.id}`);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  // Simple notification system (you can replace with a proper notification library)
  const showNotification = (message, type) => {
    // This is a placeholder - you might want to use a toast library
    alert(`${type.toUpperCase()}: ${message}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <>
      <div className="project-container">
        <div className="project-header">
          <h2>Project Management</h2>
          <div className="project-actions">
            <Button 
              variant="outline-primary" 
              onClick={showProjects}
              className="refresh-btn"
            >
              <FaSync /> Refresh
            </Button>
            <Link className="btn btn-primary add-btn" to="/admin/project/add">
              <FaPlus /> Add Project
            </Link>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found. Click "Add Project" to create your first project.</p>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <Card key={project.id} className="project-card">
                <div className="project-image-container">
                  {project.image ? (
                    <Card.Img
                      variant="top"
                      src={`data:image/jpeg;base64,${project.image}`}
                      alt={project.title}
                      onClick={() => handleImageClick(`data:image/jpeg;base64,${project.image}`)}
                      className="project-image"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <Card.Body>
                  <Card.Title>{project.title}</Card.Title>
                  <Card.Text className="project-description">
                    {project.description}
                  </Card.Text>
                  <div className="project-links">
                    {project.ghLink && (
                      <a
                        href={project.ghLink.startsWith('http') ? project.ghLink : `https://${project.ghLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                      >
                        <FaGithub /> GitHub
                      </a>
                    )}
                  </div>
                  <div className="project-card-actions">
                    <Button
                      variant="outline-primary"
                      onClick={() => handleModify(project)}
                      className="edit-btn"
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => confirmDelete(project.id)}
                      className="delete-btn"
                    >
                      <FaTrash /> Delete
                    </Button>
                    {project.image && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleImageClick(`data:image/jpeg;base64,${project.image}`)}
                        className="view-btn"
                      >
                        <FaEye /> View
                      </Button>
                    )}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Project ID: {project.id}</small>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      <ImageModal
        show={showModal}
        onHide={handleCloseModal}
        imageUrl={selectedImage}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={deleteConfirmation.show} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this project? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Project;