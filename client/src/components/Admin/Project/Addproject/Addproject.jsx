import React, { useState } from "react";
import Axios from "axios";

export const Addproject = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [ghlink, setGhlink] = useState("");
    const [img, setImg] = useState(null); // Initialize img state as null
  
    const handleImageChange = (event) => {
      // Get the file object from the input
      const file = event.target.files[0];
      setImg(file); // Set the file object to the state
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('ghlink', ghlink);
      formData.append('img', img);
      
      try {
        await Axios.post(`${process.env.REACT_APP_BACKEND_URI}/create`, formData);
        console.log("Project added successfully");
        // Optionally, reset the form after successful submission
        setTitle("");
        setDescription("");
        setGhlink("");
        setImg(null);
      } catch (error) {
        console.error("Error:", error);
      }
    };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Description</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">github link</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ghlink"
                  value={ghlink}
                  onChange={(event) => setGhlink(event.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
