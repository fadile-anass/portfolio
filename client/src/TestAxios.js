import React, { useState } from "react";
import Axios from "axios";

const TestAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await Axios.get("https://jsonplaceholder.typicode.com/posts/1");
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
      setError("Error fetching data. Please try again later.");
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {data && (
        <div>
          <h2>Title: {data.title}</h2>
          <p>Body: {data.body}</p>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
};

export default TestAxios;
