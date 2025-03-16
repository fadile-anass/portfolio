import React, { useState } from "react";
import Axios from "axios";
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSave, FaTimes, FaUpload, FaArrowLeft } from "react-icons/fa";
import "./Addproject.css";

export const Addproject = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ghlink, setGhlink] = useState("");
    const [img, setImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      setImg(file);
      
      // Create a preview URL for the selected image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviewUrl(null);
      }
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('ghlink', ghlink);
      formData.append('image', img);

      try {
        const token = localStorage.getItem('token');
        await Axios.post(
          `${process.env.REACT_APP_BACKEND_URI}/projects/create`, 
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setSuccess(true);
        setLoading(false);

        // Reset form after successful submission
        setTitle("");
        setDescription("");
        setGhlink("");
        setImg(null);
        setPreviewUrl(null);

        // Redirect to projects list after 2 seconds
        setTimeout(() => {
          navigate("/admin/project");
        }, 2000);
      } catch (error) {
        console.error("Error:", error);
        setError(error.response?.data?.message || "Failed to add project. Please try again.");
        setLoading(false);
      }
    };


    const handleCancel = () => {
      navigate("/admin/project");
    };

  return (
    <Container className="add-project-container py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4 className="mb-0">Add New Project</h4>
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
              Project added successfully! Redirecting to projects list...
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>GitHub Link</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://github.com/yourusername/project"
                    value={ghlink}
                    onChange={(e) => setGhlink(e.target.value)}
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
                    placeholder="Describe your project..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                          onClick={() => {
                            setImg(null);
                            setPreviewUrl(null);
                          }}
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
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                      className={previewUrl ? "d-none" : ""}
                    />
                  </div>
                  <Form.Text className="text-muted">
                    Select an image that represents your project. Recommended size: 1200x800px.
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
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Project
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