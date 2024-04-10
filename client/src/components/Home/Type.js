import React, { useState, useEffect } from "react";
import axios from "axios";
import Typewriter from "typewriter-effect";

function Type() {
  const [typeData, setTypeData] = useState([]);

  useEffect(() => {
    const fetchTypeData = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get("https://portfolio-xqtv.onrender.com/type");
=======
        const response = await axios.get("https://portfolio-xqtv.onrender.com/Type");
>>>>>>> 5fa83ec4aeed415e8abf758055912ee09d62eb95
        setTypeData(response.data);
      } catch (error) {
        console.error("Error fetching type data:", error);
      }
    };

    fetchTypeData();
  }, []);

  const types = typeData.map((data) => data.type);

  return (
    <Typewriter
      options={{
        strings: types, // Passing the array of types
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
