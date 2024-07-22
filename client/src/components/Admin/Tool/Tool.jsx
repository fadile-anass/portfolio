import React, {useState,useEffect}from 'react'
import { Link } from 'react-router-dom'
import { RiDeleteBinLine } from "react-icons/ri"; // Import delete icon from react-icons/ri


function Tool ()  {
    const [icons, setIcons] = useState([]);

    const fetchData = () => {
      fetch(`${process.env.REACT_APP_BACKEND_URI}/tool`)
          .then(response => response.json())
          .then(data => {
              const fetchedIcons = data.map(icon => ({
                  name: icon.name,
                  toolIcon: icon.toolIcon,
                  id: icon.id
              }));
              setIcons(fetchedIcons);
          })
          .catch(error => console.error('Error fetching icons:', error));
  };

  useEffect(() => {
      fetchData();
  }, []);

  const handleRefresh = () => {
      fetchData();
  };
  
    const handleDelete = async (id) => {
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URI}/tool/delete/${id}`, {
          method: 'DELETE'
        });
        setIcons(icons.filter(icon => icon.id !== id));
      } catch (error) {
        console.error('Error deleting icon:', error);
      }
    };

  return (
    <div className="container mt-4">
    <div className="d-flex justify-content-between mb-3">
      <button className="btn btn-primary" onClick={handleRefresh}>Refresh</button>
      <Link className="btn btn-primary" to="/admin/tool/add">Add</Link>
    </div>

    <table className="table table-striped">
      <thead className="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Icon</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {icons.map((icon) => (
          <tr key={icon.id}>
            <td>{icon.id}</td>
            <td>{icon.name}</td>
            <td>{icon.toolIcon}</td>
            <td>
              <button
                className="btn btn-outline-danger"
                onClick={() => handleDelete(icon.id)}
              >
                <RiDeleteBinLine /> Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default Tool