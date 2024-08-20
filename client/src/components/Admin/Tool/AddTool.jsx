import React, { useState } from "react";
import Axios from "axios";
const AddTool = () => {
  const [name, setName] = useState("");
  const [toolIcon, setToolIcon] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Await the Axios request and handle the response
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URI}/tool/create`,{name:name, toolIcon : toolIcon});

      // Check if the request was successful
      if (response.status === 200) {
        console.log("tool added successfully");
        // Optionally, reset the form after successful submission
        setName("");
        setToolIcon("");
      } else {
        console.error("Failed to add tool");
      }
    } catch (error) {
      // Handle Axios request errors
      console.error("Error:", error);
    }
  };
  return (
    <div className="container">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <form onSubmit={handleSubmit} >
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">name</label>
              <input
                type="text"
                className="form-control"
                placeholder="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">icon name</label>
              <input
                type="text"
                className="form-control"
                placeholder="toolIcon"
                value={toolIcon}
                onChange={(event) => setToolIcon(event.target.value)}
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
  )
}

export default AddTool