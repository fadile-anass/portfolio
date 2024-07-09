const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 
const fs = require('fs');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "nimble-gnu-5795.6zw.aws-eu-west-1.cockroachlabs.cloud",
  user: "anass",
  password: "_kAfRzEF9jd6xazu-14ZJg",
  database: "defaultdb",
  port: 26257, // Port number extracted from the connection string
  ssl: {
    rejectUnauthorized: true, // Equivalent to `sslmode=verify-full` in PostgreSQL
  },
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database");
});

app.post("/create", upload.single('img'), (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const ghlink = req.body.ghlink;
    const imgPath = req.file.path; 

    const imgData = fs.readFileSync(imgPath);
    
    db.query(
      "INSERT INTO projects (title, description, ghlink, image) VALUES (?, ?, ?, ?)",
      [title, description, ghlink ,imgData],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into database:", err);
          res.status(500).send("Error inserting data into database");
        } else {
          console.log("Data inserted successfully");
          res.status(200).send("Data inserted successfully");
        }
      }
    );
});

app.get("/projects", (req, res) => {
  db.query("SELECT * FROM projects", (err, results) => {
    if (err) {
      console.error("Error retrieving data from database:", err);
      res.status(500).send("Error retrieving data from database");
    } else {
      // Convert BLOBs to Base64-encoded strings before sending the response
      const projectsWithBase64Images = results.map(project => {
        // Convert the BLOB image data to a Base64-encoded string
        const base64Image = project.image.toString("base64");
        // Create a new object with the Base64-encoded image data
        return {
          ...project,
          image: base64Image
        };
      });
      res.send(projectsWithBase64Images);
    }
  });
});
app.delete("/delete/:id", (req, res) => {
  const projectId = req.params.id;

  db.query("DELETE FROM projects WHERE id = ?", projectId, (err, result) => {
    if (err) {
      console.error("Error deleting project:", err);
      res.status(500).send("Error deleting project");
    } else {
      console.log("Project deleted successfully");
      res.status(200).send("Project deleted successfully");
    }
  });
});


app.get("/projects/:id", (req, res) => {
  const projectId = req.params.id;

  db.query("SELECT * FROM projects WHERE id = ?", projectId, (err, results) => {
    if (err) {
      console.error("Error retrieving project:", err);
      res.status(500).send("Error retrieving project");
    } else {
      if (results.length > 0) {
        // Assuming that your project data is stored in the first element of the results array
        const project = results[0];
        res.status(200).send(project);
      } else {
        res.status(404).send("Project not found");
      }
    }
  });
});


app.put("/update/:projectId", upload.single('image'), (req, res) => {
  const projectId = req.params.projectId;
  const title = req.body.title;
  const description = req.body.description;
  const ghLink = req.body.ghLink;
  const image = req.file.path; 

  const imgData = fs.readFileSync(image);
  // Check if all required fields are provided


  // Now, you can pass the 'title', 'description', 'ghLink', 'image', and 'projectId' values
  // to the 'db.query()' function as arguments.
  db.query(
    "UPDATE projects SET title = ?, description = ?, ghlink = ?, image = ? WHERE id = ?",
    [title, description, ghLink, imgData, projectId],
    (err, result) => {
      if (err) {
        console.error("Error updating project:", err);
        res.status(500).send("Error updating project");
      } else {
        console.log("Project updated successfully");
        res.status(200).send("Project updated successfully");
      }
    }
  );
});




//=============================================for resume==========================================================================
const fss = require('fs');

app.get("/resume", (req, res) => {
  db.query("SELECT * FROM resume", (err, results) => {
    if (err) {
      console.error("Error retrieving data from database:", err);
      res.status(500).send("Error retrieving data from database");
    } else {
      if (results.length === 0) {
        res.status(404).send("No resumes found");
      } else {
        // Initialize an array to store resume data
        const resumes = [];

        // Iterate through the results and read each PDF file
        results.forEach((resumeData) => {
          const pdfPath = resumeData.pdf; // Assuming the 'pdf' column stores the path to the PDF file

          // Read the PDF file
          fss.readFile(pdfPath, (err, data) => {
            if (err) {
              console.error("Error reading PDF file:", err);
              res.status(500).send("Error reading PDF file");
              return; // Exit early if there's an error
            }

            // Push the resume data along with the PDF data to the resumes array
            resumes.push({
              id: resumeData.id, // Assuming there's an 'id' column in your 'resume' table
              name: resumeData.name, // Assuming there's a 'name' column in your 'resume' table
              Link: resumeData.Link, // Assuming there's a 'link' column in your 'resume' table
              pdf: data // PDF data
            });

            // Check if all resumes have been processed
            if (resumes.length === results.length) {
              // Send the resumes array as the response
              res.send(resumes);
            }
          });
        });
      }
    }
  });
});




app.post("/resume/create", upload.single('pdf'), (req, res) => {
  const name = req.body.name;
  const link = req.body.link;
  const pdf = req.file.path; 

  // const imgData = fs.readFileSync(imgPath);
  
  db.query(
    "INSERT INTO resume (name, link, pdf) VALUES (?, ?, ?)",
    [name ,link ,pdf],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Data inserted successfully");
      }
    }
  );
});

app.delete("/resume/delete/:id", (req, res) => {
  const resumeId = req.params.id;

  db.query("DELETE FROM resume WHERE id = ?", resumeId, (err, result) => {
    if (err) {
      console.error("Error deleting project:", err);
      res.status(500).send("Error deleting project");
    } else {
      console.log("Project deleted successfully");
      res.status(200).send("Project deleted successfully");
    }
  });
});


//===========================skills===============================
app.post("/skills/create", (req, res) => {
  const { name, iconName } = req.body;
  
  console.log("Name:", name);
  console.log("Icon Name:", iconName);
  
  db.query(
    "INSERT INTO skills (name, iconName) VALUES (?, ?)",
    [name, iconName],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Data inserted successfully");
      }
    }
  );
});

app.get("/skills", (req, res) => {
  db.query("SELECT * FROM skills", (err, results) => {
    if (err) {
      console.error("Error querying skills:", err);
      res.status(500).send("Error fetching skills");
    } else {
      res.json(results);
    }
  });
});

app.delete("/skills/delete/:id", (req, res) => {
  const skillsId = req.params.id;

  db.query("DELETE FROM skills WHERE id = ?", skillsId, (err, result) => {
    if (err) {
      console.error("Error deleting skill:", err);
      res.status(500).send("Error deleting skill");
    } else {
      console.log("Skill deleted successfully");
      res.status(200).send("Skill deleted successfully");
    }
  });
});


//======================Tech========================================
app.post("/tool/create", (req, res) => {
  const { name, toolIcon } = req.body;
  
  console.log("Name:", name);
  console.log("tool Icon:", toolIcon);
  
  db.query(
    "INSERT INTO tool (name, toolIcon) VALUES (?, ?)",
    [name, toolIcon],
    (err, result) => {
      if (err) {
        console.error("Error inserting data into database:", err);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.status(200).send("Data inserted successfully");
      }
    }
  );
});

app.get("/tool", (req, res) => {
  db.query("SELECT * FROM tool", (err, results) => {
    if (err) {
      console.error("Error querying tool:", err);
      res.status(500).send("Error fetching tool");
    } else {
      res.json(results);
    }
  });
});

app.delete("/tool/delete/:id", (req, res) => {
  const toolId = req.params.id;

  db.query("DELETE FROM tool WHERE id = ?", toolId, (err, result) => {
    if (err) {
      console.error("Error deleting tool:", err);
      res.status(500).send("Error deleting tool");
    } else {
      console.log("tool deleted successfully");
      res.status(200).send("tool deleted successfully");
    }
  });
});

//=====================Type===========================
app.get("/type", (req, res) => {
  db.query("SELECT * FROM type", (err, results) => {
    console.log(results);
    if (err) {
      console.error("Error querying tool:", err);
      res.status(500).send("Error fetching tool");
    } else {
      res.json(results);
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
