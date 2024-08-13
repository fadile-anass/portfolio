require('dotenv').config(); // Add this line at the top of your file
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

app.use(cors());
app.use(express.json());

const supabaseUrl = 'https://urpzmuesnvwagloghman.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to read file data
const readFileData = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

// Handle file upload and storage
app.post("/create", upload.single('img'), async (req, res) => {
  const { title, description, ghlink } = req.body;
  const imgPath = req.file.path;

  try {
    const imgData = await readFileData(imgPath);
    
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, description, ghlink, image: imgData }]);

    if (error) {
      console.error("Error inserting data into database:", error);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Data inserted successfully");
    }
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Error reading file");
  }
});

app.get("/projects", async (req, res) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*');

  if (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).send("Error retrieving data from database");
  } else {
    const projectsWithBase64Images = data.map(project => {
      const base64Image = Buffer.from(project.image).toString("base64");
      return { ...project, image: base64Image };
    });
    res.send(projectsWithBase64Images);
  }
});

app.delete("/delete/:id", async (req, res) => {
  const projectId = req.params.id;

  const { error } = await supabase
    .from('projects')
    .delete()
    .match({ id: projectId });

  if (error) {
    console.error("Error deleting project:", error);
    res.status(500).send("Error deleting project");
  } else {
    console.log("Project deleted successfully");
    res.status(200).send("Project deleted successfully");
  }
});

app.get("/projects/:id", async (req, res) => {
  const projectId = req.params.id;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error("Error retrieving project:", error);
    res.status(500).send("Error retrieving project");
  } else {
    if (data) {
      res.status(200).send(data);
    } else {
      res.status(404).send("Project not found");
    }
  }
});

app.put("/update/:projectId", upload.single('image'), async (req, res) => {
  const projectId = req.params.projectId;
  const { title, description, ghLink } = req.body;
  const imagePath = req.file.path;

  try {
    const imgData = await readFileData(imagePath);

    const { error } = await supabase
      .from('projects')
      .update({ title, description, ghlink: ghLink, image: imgData })
      .eq('id', projectId);

    if (error) {
      console.error("Error updating project:", error);
      res.status(500).send("Error updating project");
    } else {
      console.log("Project updated successfully");
      res.status(200).send("Project updated successfully");
    }
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Error reading file");
  }
});

// Handle resume operations
app.get("/resume", async (req, res) => {
  const { data, error } = await supabase
    .from('resume')
    .select('*');

  if (error) {
    console.error("Error retrieving data from database:", error);
    res.status(500).send("Error retrieving data from database");
  } else {
    if (data.length === 0) {
      res.status(404).send("No resumes found");
    } else {
      const resumes = data.map(async (resumeData) => {
        const pdfPath = resumeData.pdf;

        try {
          const pdfData = await readFileData(pdfPath);
          return {
            id: resumeData.id,
            name: resumeData.name,
            link: resumeData.link,
            pdf: pdfData
          };
        } catch (err) {
          console.error("Error reading PDF file:", err);
          return null;
        }
      });

      const resumesWithPdfData = await Promise.all(resumes);
      res.send(resumesWithPdfData.filter(resume => resume !== null));
    }
  }
});

app.post("/resume/create", upload.single('pdf'), async (req, res) => {
  const { name, link } = req.body;
  const pdfPath = req.file.path;

  try {
    const pdfData = await readFileData(pdfPath);
    
    const { error } = await supabase
      .from('resume')
      .insert([{ name, link, pdf: pdfData }]);

    if (error) {
      console.error("Error inserting data into database:", error);
      res.status(500).send("Error inserting data into database");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Data inserted successfully");
    }
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Error reading file");
  }
});

app.delete("/resume/delete/:id", async (req, res) => {
  const resumeId = req.params.id;

  const { error } = await supabase
    .from('resume')
    .delete()
    .match({ id: resumeId });

  if (error) {
    console.error("Error deleting resume:", error);
    res.status(500).send("Error deleting resume");
  } else {
    console.log("Resume deleted successfully");
    res.status(200).send("Resume deleted successfully");
  }
});

// Handle skills operations
app.post("/skills/create", async (req, res) => {
  const { name, iconName } = req.body;

  const { error } = await supabase
    .from('skills')
    .insert([{ name, iconName }]);

  if (error) {
    console.error("Error inserting data into database:", error);
    res.status(500).send("Error inserting data into database");
  } else {
    console.log("Data inserted successfully");
    res.status(200).send("Data inserted successfully");
  }
});

app.get("/skills", async (req, res) => {
  const { data, error } = await supabase
    .from('skills')
    .select('*');

  if (error) {
    console.error("Error querying skills:", error);
    res.status(500).send("Error fetching skills");
  } else {
    res.json(data);
  }
});

app.delete("/skills/delete/:id", async (req, res) => {
  const skillsId = req.params.id;

  const { error } = await supabase
    .from('skills')
    .delete()
    .match({ id: skillsId });

  if (error) {
    console.error("Error deleting skill:", error);
    res.status(500).send("Error deleting skill");
  } else {
    console.log("Skill deleted successfully");
    res.status(200).send("Skill deleted successfully");
  }
});

// Handle tool operations
app.post("/tool/create", async (req, res) => {
  const { name, toolIcon } = req.body;

  const { error } = await supabase
    .from('tool')
    .insert([{ name, toolIcon }]);

  if (error) {
    console.error("Error inserting data into database:", error);
    res.status(500).send("Error inserting data into database");
  } else {
    console.log("Data inserted successfully");
    res.status(200).send("Data inserted successfully");
  }
});

app.get("/tool", async (req, res) => {
  const { data, error } = await supabase
    .from('tool')
    .select('*');

  if (error) {
    console.error("Error querying tool:", error);
    res.status(500).send("Error fetching tool");
  } else {
    res.json(data);
  }
});

app.delete("/tool/delete/:id", async (req, res) => {
  const toolId = req.params.id;

  const { error } = await supabase
    .from('tool')
    .delete()
    .match({ id: toolId });

  if (error) {
    console.error("Error deleting tool:", error);
    res.status(500).send("Error deleting tool");
  } else {
    console.log("Tool deleted successfully");
    res.status(200).send("Tool deleted successfully");
  }
});

// Handle type operations
app.get("/type", async (req, res) => {
  const { data, error } = await supabase
    .from('type')
    .select('*');

  if (error) {
    console.error("Error querying type:", error);
    res.status(500).send("Error fetching type");
  } else {
    res.json(data);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
