import React, { useState } from "react";
import Axios from "axios";
import { Card, Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaTools, FaSave, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import '../Skills/Skills.css'; // Reuse the same CSS file

const AddTool = () => {
  const [name, setName] = useState("");
  const [toolIcon, setToolIcon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Await the Axios request and handle the response
      const response = await Axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/tool/create`,
        { name: name, toolIcon: toolIcon },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Tool added successfully");
        setSuccess(true);
        // Reset the form after successful submission
        setName("");
        setToolIcon("");
        
        // Redirect back to tools list after 2 seconds
        setTimeout(() => {
          navigate('/admin/tool');
        }, 2000);
      } else {
        setError("Failed to add tool. Please try again.");
      }
    } catch (error) {
      // Handle Axios request errors
      console.error("Error:", error);
      
      if (error.response?.status === 401) {
        setError("Unauthorized: Your session may have expired. Please log in again.");
      } else {
        setError(error.response?.data?.message || error.message || "An error occurred while adding the tool.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="skills-container py-4">
      <Link to="/admin/tool" className="btn btn-outline-secondary mb-3 back-btn">
        <FaArrowLeft /> Back to Tools
      </Link>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <FaTools className="me-2" />
            <h4 className="mb-0">Add New Tool</h4>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(false)}>
              Tool added successfully! Redirecting to tools list...
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="toolName">
                  <Form.Label>Tool Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter tool name (e.g. VS Code, Figma, Docker)"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Enter the name of the tool or software
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group controlId="toolIcon">
                  <Form.Label>Tool Icon</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter icon name (e.g. SiVisualstudiocode, SiFigma)"
                    value={toolIcon}
                    onChange={(event) => setToolIcon(event.target.value)}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Enter the icon name from Simple Icons (e.g., SiReact, SiJavascript)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="icon-preview mb-4">
              <h6>Icon Preview</h6>
              <div className="preview-box p-3 border rounded bg-light text-center">
                {toolIcon ? (
                  <div>
                    <code className="d-block mb-2">{toolIcon}</code>
                    <div className="text-muted">
                      (Preview not available in edit mode - will be displayed on the frontend)
                    </div>
                  </div>
                ) : (
                  <span className="text-muted">Enter an icon name to see preview</span>
                )}
              </div>
              <small className="text-muted d-block mt-2">
                You can find icon names at <a href="https://react-icons.github.io/react-icons/icons?name=si" target="_blank" rel="noopener noreferrer">React Icons - Simple Icons</a>
              </small>
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                as={Link} 
                to="/admin/tool" 
                className="me-2"
                disabled={loading}
              >
                Cancel
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
                    <FaSave className="me-2" /> Save Tool
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>* All fields are required</small>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AddTool;