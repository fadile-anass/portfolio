import React, { useState, useEffect } from "react";
import "./Project.css";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate hook
import { Modal, Button } from "react-bootstrap";
import ImageModal from "../../layout/ImageModal"; // Import the modal component

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [updateData, setUpdateData] = useState({}); // State to hold data for updating
  const Navigate = useNavigate();


  useEffect(() => {
    showProjects();
  }, []);

  const showProjects = () => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URI}/projects`)
      .then((response) => {
        setProjects(response.data); // Update projects state with data from the server
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDelete = (projectId) => {
    Axios.delete(`${process.env.REACT_APP_BACKEND_URI}/projects/delete/${projectId}`)
      .then((response) => {
        console.log("Project deleted successfully");
        setProjects(projects.filter(project => project.id !== projectId));
        showProjects(); // Refresh the project list after deletion
      })
      .catch((error) => {
        console.error("Error deleting project:", error);
      });
  };

  const handleModify = (project) => {
    // Implement modify functionality here

    setUpdateData({
      id: project.id,
      title: project.title,
      description: project.description,
      ghLink: project.ghLink,
      image:project.image,
    });
    Navigate(`/240902/project/update/${project.id}`);
    console.log(`Modifying project with ID ${project.id}`);

  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-primary" onClick={showProjects}>
            Refresh
          </button>
          <Link className="btn btn-primary" to="/240902/project/add">
            Add
          </Link>
        </div>

        <table className="table table-striped">
          <thead className="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Description</th>
              <th scope="col">Github link</th>
              <th scope="col">Image</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>
                  {/* Check if ghlink is available */}

                  {project.ghLink ? (
                    <a
                      href={"https://" +project.ghLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>) : ("N/A")}
                </td>
                <td>
                  {project.image && (
                    <img
                      src={`data:image/jpeg;base64,${project.image}`}
                      alt={project.name}
                      className="img-thumbnail"
                      onClick={() =>
                        handleImageClick(
                          `data:image/jpeg;base64,${project.image}`
                        )
                      } // Call handleImageClick on click
                      style={{ cursor: "pointer" }} // Change cursor to pointer on hover
                    />
                  )}
                </td>
                <td>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic checkbox toggle button group"
                  >
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => handleModify(project)}
                    >
                      Modify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Render the modal */}
      <ImageModal
        show={showModal}
        onHide={handleCloseModal}
        imageUrl={selectedImage}
      />
    </>
  );
};

export default Project;
