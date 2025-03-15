import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RiDeleteBinLine, RiRefreshLine, RiAddCircleLine } from "react-icons/ri";
import { FaTools } from "react-icons/fa";
import { Card, Button, Table, Badge, Spinner, Alert, Container } from 'react-bootstrap';
import '../Skills/Skills.css'; // Reuse the same CSS file

function Tool() {
  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/tool`);
      if (!response.ok) {
        throw new Error('Failed to fetch tools');
      }
      const data = await response.json();
      const fetchedIcons = data.map(icon => ({
        name: icon.name,
        toolIcon: icon.toolIcon,
        id: icon.id
      }));
      setIcons(fetchedIcons);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setError('Failed to load tools. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/tool/delete/${id}`, {
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
        throw new Error(errorData?.message || 'Failed to delete tool');
      }
      
      setIcons(icons.filter(icon => icon.id !== id));
      setSuccessMessage('Tool deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error deleting tool:', error);
      setError(error.message || 'Failed to delete tool. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Container className="skills-container py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaTools className="me-2" />
            <h4 className="mb-0">Tools Management</h4>
          </div>
          <div>
            <Button 
              variant="outline-light" 
              className="me-2 refresh-btn" 
              onClick={fetchData}
              disabled={loading}
            >
              <RiRefreshLine /> Refresh
            </Button>
            <Link to="/admin/tool/add" className="btn btn-light add-btn">
              <RiAddCircleLine /> Add New Tool
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
              <p className="mt-3 text-muted">Loading tools...</p>
            </div>
          ) : icons.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty-state">
                <FaTools size={50} className="text-muted mb-3" />
                <h5>No tools found</h5>
                <p className="text-muted">Add your first tool to get started</p>
                <Link to="/admin/tool/add" className="btn btn-primary mt-2">
                  <RiAddCircleLine /> Add New Tool
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
                        <code className="icon-name">{icon.toolIcon}</code>
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
          <small>Total Tools: {icons.length}</small>
        </Card.Footer>
      </Card>
    </Container>
  );
}

export default Tool;