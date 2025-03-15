import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { FaSave, FaTimes, FaUpload, FaArrowLeft } from "react-icons/fa";
import "./Updateproject.css";

const Updateproject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    ghLink: "",
    image: null
  });
  
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [originalImageUrl, setOriginalImageUrl] = useState("");

  useEffect(() => {
    const fetchProjectData = async () => {
      setFetchLoading(true);
      try {
        const response = await Axios.get(`${process.env.REACT_APP_BACKEND_URI}/projects/${id}`);
        setProjectData(response.data);
        
        // Set the original image URL for preview
        if (response.data.imageUrl) {
          setOriginalImageUrl(response.data.imageUrl);
          setPreviewUrl(response.data.imageUrl);
        }
        
        setFetchLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setError("Failed to load project data. Please try again.");
        setFetchLoading(false);
      }
    };
    
    fetchProjectData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProjectData({
      ...projectData,
      [name]: value
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      setProjectData({
        ...projectData,
        image: file
      });
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("ghLink", projectData.ghLink);
    
    // Only append image if a new one was selected
    if (projectData.image instanceof File) {
      formData.append("image", projectData.image);
    }
    
    try {
      await Axios.put(`${process.env.REACT_APP_BACKEND_URI}/projects/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Redirect to projects list after 2 seconds
      setTimeout(() => {
        navigate("/admin/project");
      }, 2000);
    } catch (error) {
      console.error("Error updating project:", error);
      setError(error.response?.data?.message || "Failed to update project. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/project");
  };

  const resetImage = () => {
    setProjectData({
      ...projectData,
      image: null
    });
    setPreviewUrl(originalImageUrl);
  };

  if (fetchLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading project data...</span>
      </Container>
    );
  }

  return (
    <Container className="update-project-container py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4 className="mb-0">Update Project</h4>
          </div>
          <Button 
            variant="outline-light" 
            size="sm" 
            onClick={handleCancel}
            className="back-button"
          >
            <FaArrowLeft /> Back to Projects
          </Button>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
              Project updated successfully! Redirecting to projects list...
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter project title"
                    value={projectData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>GitHub Link</Form.Label>
                  <Form.Control
                    type="text"
                    name="ghLink"
                    placeholder="https://github.com/yourusername/project"
                    value={projectData.ghLink}
                    onChange={handleChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Enter the full URL to your GitHub repository
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Project Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    placeholder="Describe your project..."
                    value={projectData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Image</Form.Label>
                  <div className="image-upload-container">
                    {previewUrl ? (
                      <div className="image-preview-wrapper">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="image-preview"
                        />
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="remove-image-btn"
                          onClick={resetImage}
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <FaUpload size={30} />
                        <p>Click to select an image</p>
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      className={previewUrl ? "d-none" : ""}
                    />
                  </div>
                  <Form.Text className="text-muted">
                    {previewUrl === originalImageUrl 
                      ? "Using current image. Select a new image to replace it." 
                      : previewUrl 
                        ? "New image selected. Submit to update." 
                        : "Select an image that represents your project."}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={handleCancel}
                disabled={loading}
              >
                <FaTimes /> Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave /> Update Project
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Updateproject;