import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

const Updateproject = () => {
  const { id } = useParams(); // Get id from URL params
  console.log("ID:", id); // Log the id to the console to test

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    ghLink: "",
    image: null // Add image property to projectData state
  });

  useEffect(() => {
    // Fetch project data when component mounts
    const fetchProjectData = async () => {
      try {
        const response = await Axios.get(`${process.env.REACT_APP_BACKEND_URI}/projects/${id}`);
        setProjectData(response.data); // Update projectData state with project details
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    
    fetchProjectData();
  }, [id]); // Re-fetch project data when id changes

  const handleChange = (event) => {
    // Update projectData state when input values change
    if (event.target.name === "image") {
      // Handle image file input separately
      setProjectData({
        ...projectData,
        [event.target.name]: event.target.files[0] // Update image property with selected file
      });
    } else {
      setProjectData({
        ...projectData,
        [event.target.name]: event.target.value
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Create FormData object to send project data as multipart/form-data
    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("description", projectData.description);
    formData.append("ghLink", projectData.ghLink);
    formData.append("image", projectData.image); // Append image file to FormData
    
    try {
      // Send updated project data to the server for updating
      await Axios.put(`${process.env.REACT_APP_BACKEND_URI}/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data" // Set content type as multipart/form-data
        }
      });
      console.log("Project updated successfully");
      // Optionally, redirect to project list page after successful update
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <div className="container">
      <h1>Update Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={projectData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={projectData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Github Link</label>
          <input
            type="text"
            className="form-control"
            name="ghLink"
            value={projectData.ghLink}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            className="form-control-file"
            name="image"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
};

export default Updateproject;
