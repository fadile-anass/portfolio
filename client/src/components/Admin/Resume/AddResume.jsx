import React, { useState } from "react";
import Axios from "axios";

const AddResume = () => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [pdf, setPdf] = useState(null); // Initialize pdf state as null

    const handlePdfChange = (event) => {
        setPdf(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append('name', name);
      formData.append('link', link);
      formData.append('pdf', pdf);
      
      try {
        // Correctly use the environment variable in the URL
        await Axios.post(`${process.env.REACT_APP_BACKEND_URI}/resume/create`, formData);
        console.log("Resume added successfully");
        // Optionally, reset the form after successful submission
        setName("");
        setLink("");
        setPdf(null);
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
                <label htmlFor="inputTitle">Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputLink">Link</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Link"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPdf">PDF</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handlePdfChange}
                  accept=".pdf"
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

export default AddResume;
