import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { RiDeleteBinLine, RiRefreshLine, RiAddCircleLine } from "react-icons/ri";
import { FaCode } from "react-icons/fa";
import { Card, Button, Table, Badge, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import './Skills.css';

function Skills() {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/Skills`);
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      const data = await response.json();
      const fetchedIcons = data.map(icon => ({
        name: icon.name,
        iconName: icon.iconName,
        id: icon.id
      }));
      setIcons(fetchedIcons);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching icons:', error);
      setError('Failed to load skills. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    setError(null);
    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/skills/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        throw new Error('Unauthorized: Your session may have expired. Please log in again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete skill');
      }
      
      setIcons(icons.filter(icon => icon.id !== id));
      setSuccessMessage('Skill deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting icon:', error);
      setError(error.message || 'Failed to delete skill. Please try again.');
      
      // If unauthorized, redirect to login page
      if (error.message.includes('Unauthorized') || error.message.includes('token')) {
        // You can add a redirect to login page here if needed
        // Example: setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Container className="skills-container py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaCode className="me-2" />
            <h4 className="mb-0">Skills Management</h4>
          </div>
          <div>
            <Button 
              variant="outline-light" 
              className="me-2 refresh-btn" 
              onClick={fetchSkills}
              disabled={loading}
            >
              <RiRefreshLine /> Refresh
            </Button>
            <Link to="/admin/Skills/add" className="btn btn-light add-btn">
              <RiAddCircleLine /> Add New Skill
            </Link>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          
          {successMessage && (
            <Alert variant="success" dismissible onClose={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading skills...</p>
            </div>
          ) : icons.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-state">
                <FaCode size={50} className="text-muted mb-3" />
                <h5>No skills found</h5>
                <p className="text-muted">Add your first skill to get started</p>
                <Link to="/admin/Skills/add" className="btn btn-primary mt-2">
                  <RiAddCircleLine /> Add New Skill
                </Link>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="skills-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Icon</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {icons.map((icon) => (
                    <tr key={icon.id} className="skill-row">
                      <td>
                        <Badge bg="light" text="dark" className="id-badge">
                          {icon.id}
                        </Badge>
                      </td>
                      <td className="skill-name">{icon.name}</td>
                      <td>
                        <code className="icon-name">{icon.iconName}</code>
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(icon.id)}
                          disabled={deleteLoading === icon.id}
                          className="delete-btn"
                        >
                          {deleteLoading === icon.id ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            <RiDeleteBinLine />
                          )}{' '}
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="text-muted">
          <small>Total Skills: {icons.length}</small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Skills;