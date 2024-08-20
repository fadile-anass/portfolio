import React, { useState } from "react";
import Axios from "axios";

const AddSkills = () => {
  const [name, setName] = useState("");
  const [iconName, setIconName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Await the Axios request and handle the response
      const response = await Axios.post(`${process.env.REACT_APP_BACKEND_URI}/skills/create`,{name:name, iconName : iconName});

      // Check if the request was successful
      if (response.status === 200) {
        console.log("Skill added successfully");
        // Optionally, reset the form after successful submission
        setName("");
        setIconName("");
      } else {
        console.error("Failed to add skill");
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
                  placeholder="title"
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
                  placeholder="ghlink"
                  value={iconName}
                  onChange={(event) => setIconName(event.target.value)}
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

export default AddSkills;
