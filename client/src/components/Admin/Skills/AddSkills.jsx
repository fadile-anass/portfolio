import React, { useState } from "react";
import Axios from "axios";
import { Card, Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaCode, FaSave, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import './Skills.css';

const AddSkills = () => {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      // Await the Axios request and handle the response
      const response = await Axios.post(
        `${process.env.REACT_APP_BACKEND_URI}/skills/create`,
        { name: name, iconName: iconName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Skill added successfully");
        setSuccess(true);
        // Reset the form after successful submission
        setName("");
        setIconName("");
      } else {
        setError("Failed to add skill. Please try again.");
      }
    } catch (error) {
      // Handle Axios request errors
      console.error("Error:", error);
      setError(error.response?.data?.message || "An error occurred while adding the skill.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container className="skills-container py-4">
      <Link to="/admin/Skills" className="btn btn-outline-secondary mb-3 back-btn">
        <FaArrowLeft /> Back to Skills
      </Link>
      
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex align-items-center">
            <FaCode className="me-2" />
            <h4 className="mb-0">Add New Skill</h4>
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
              Skill added successfully!
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="skillName">
                  <Form.Label>Skill Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter skill name (e.g. JavaScript, React, Node.js)"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Enter the name of the technology or skill
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group controlId="iconName">
                  <Form.Label>Icon Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter icon name (e.g. FaReact, SiJavascript)"
                    value={iconName}
                    onChange={(event) => setIconName(event.target.value)}
                    required
                    disabled={loading}
                  />
                  <Form.Text className="text-muted">
                    Enter the React Icon component name
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-3">
              <Button 
                variant="primary" 
                type="submit"
                className="submit-btn"
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
                    Adding...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Add Skill
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>
            <strong>Note:</strong> For icon names, refer to the{" "}
            <a 
              href="https://react-icons.github.io/react-icons/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              React Icons library
            </a>
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AddSkills;