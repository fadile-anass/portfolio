require('dotenv').config(); // Load environment variables
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require('path');

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database Connection
const pool = mysql.createPool({
  uri: process.env.mysql_uri,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
const promisePool = pool.promise();

// File Upload Configuration using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Default Route to Render EJS Template
app.get("/", (req, res) => {
  res.render('index', { message: 'Hello World' });
});

// Routes
app.post("/create", upload.single('img'), async (req, res) => {
  try {
    const { title, description, ghlink } = req.body;
    const imgData = req.file.buffer; // Image data in memory

    await promisePool.query(
      "INSERT INTO projects (title, description, ghlink, image) VALUES (?, ?, ?, ?)",
      [title, description, ghlink, imgData]
    );
    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data into database:", err);
    res.status(500).send("Error inserting data into database");
  }
});

app.get("/projects", async (req, res) => {
  try {
    const [results] = await promisePool.query("SELECT * FROM projects");
    const projectsWithBase64Images = results.map(project => {
      const base64Image = project.image.toString("base64");
      return { ...project, image: base64Image };
    });
    res.json(projectsWithBase64Images);
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Error retrieving data from database");
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    await promisePool.query("DELETE FROM projects WHERE id = ?", [projectId]);
    res.status(200).send("Project deleted successfully");
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).send("Error deleting project");
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const projectId = req.params.id;
    const [results] = await promisePool.query("SELECT * FROM projects WHERE id = ?", [projectId]);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send("Project not found");
    }
  } catch (err) {
    console.error("Error retrieving project:", err);
    res.status(500).send("Error retrieving project");
  }
});

app.put("/update/:projectId", upload.single('image'), async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { title, description, ghLink } = req.body;
    const imgData = req.file.buffer; // Image data in memory

    await promisePool.query(
      "UPDATE projects SET title = ?, description = ?, ghlink = ?, image = ? WHERE id = ?",
      [title, description, ghLink, imgData, projectId]
    );
    res.status(200).send("Project updated successfully");
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).send("Error updating project");
  }
});

// Resume Routes
app.get("/resume", async (req, res) => {
  try {
    const [results] = await promisePool.query("SELECT * FROM resume");
    if (results.length === 0) {
      res.status(404).send("No resumes found");
    } else {
      const resumes = await Promise.all(results.map(async (resumeData) => {
        const pdfPath = resumeData.pdf;
        try {
          const data = await fs.promises.readFile(pdfPath);
          return {
            id: resumeData.id,
            name: resumeData.name,
            link: resumeData.link,
            pdf: data
          };
        } catch (err) {
          console.error("Error reading PDF file:", err);
          return null;
        }
      }));
      res.json(resumes.filter(resume => resume !== null));
    }
  } catch (err) {
    console.error("Error retrieving data from database:", err);
    res.status(500).send("Error retrieving data from database");
  }
});

app.post("/resume/create", upload.single('pdf'), async (req, res) => {
  try {
    const { name, link } = req.body;
    const pdfData = req.file.buffer; // PDF data in memory

    await promisePool.query(
      "INSERT INTO resume (name, link, pdf) VALUES (?, ?, ?)",
      [name, link, pdfData]
    );
    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data into database:", err);
    res.status(500).send("Error inserting data into database");
  }
});

app.delete("/resume/delete/:id", async (req, res) => {
  try {
    const resumeId = req.params.id;
    await promisePool.query("DELETE FROM resume WHERE id = ?", [resumeId]);
    res.status(200).send("Resume deleted successfully");
  } catch (err) {
    console.error("Error deleting resume:", err);
    res.status(500).send("Error deleting resume");
  }
});

// Skills Routes
app.post("/skills/create", async (req, res) => {
  try {
    const { name, iconName } = req.body;
    await promisePool.query(
      "INSERT INTO skills (name, iconName) VALUES (?, ?)",
      [name, iconName]
    );
    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data into database:", err);
    res.status(500).send("Error inserting data into database");
  }
});

app.get("/skills", async (req, res) => {
  try {
    const [results] = await promisePool.query("SELECT * FROM skills");
    res.json(results);
  } catch (err) {
    console.error("Error querying skills:", err);
    res.status(500).send("Error fetching skills");
  }
});

app.delete("/skills/delete/:id", async (req, res) => {
  try {
    const skillsId = req.params.id;
    await promisePool.query("DELETE FROM skills WHERE id = ?", [skillsId]);
    res.status(200).send("Skill deleted successfully");
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).send("Error deleting skill");
  }
});

// Tool Routes
app.post("/tool/create", async (req, res) => {
  try {
    const { name, toolIcon } = req.body;
    await promisePool.query(
      "INSERT INTO tool (name, toolIcon) VALUES (?, ?)",
      [name, toolIcon]
    );
    res.status(200).send("Data inserted successfully");
  } catch (err) {
    console.error("Error inserting data into database:", err);
    res.status(500).send("Error inserting data into database");
  }
});

app.get("/tool", async (req, res) => {
  try {
    const [results] = await promisePool.query("SELECT * FROM tool");
    res.json(results);
  } catch (err) {
    console.error("Error querying tool:", err);
    res.status(500).send("Error fetching tool");
  }
});

app.delete("/tool/delete/:id", async (req, res) => {
  try {
    const toolId = req.params.id;
    await promisePool.query("DELETE FROM tool WHERE id = ?", [toolId]);
    res.status(200).send("Tool deleted successfully");
  } catch (err) {
    console.error("Error deleting tool:", err);
    res.status(500).send("Error deleting tool");
  }
});

// Type Routes
app.get("/type", async (req, res) => {
  try {
    const [results] = await promisePool.query("SELECT * FROM type");
    res.json(results);
  } catch (err) {
    console.error("Error querying type:", err);
    res.status(500).send("Error fetching type");
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
