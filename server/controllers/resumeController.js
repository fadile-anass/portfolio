const resumeModel = require('../models/resumeModel');
const fs = require('fs');
const path = require('path');

exports.createResume = async (req, res) => {
  try {
    const { name, link } = req.body;
    const pdfPath = req.file.path;

    await resumeModel.createResume(name, link, pdfPath);
    res.status(201).json({ message: "Resume created successfully" });
  } catch (err) {
    console.error("Error creating resume:", err);
    res.status(500).json({ error: "Error creating resume" });
  }
};


exports.getAllResumes = async (req, res) => {
  try {
    const [results] = await resumeModel.getAllResumes();
    const resumes = results.map(resume => {
      try {
        // Use path.join with __dirname to create an absolute path relative to the server
        const pdfPath = path.join(process.cwd(), resume.pdf);
        
        // Check if file exists before trying to read it
        if (fs.existsSync(pdfPath)) {
          const pdfData = fs.readFileSync(pdfPath);
          return { ...resume, pdf: pdfData };
        } else {
          console.error(`PDF file not found at ${pdfPath}`);
          // Return the path for debugging
          return { ...resume, pdf: null, debugPath: pdfPath, originalPath: resume.pdf };
        }
      } catch (fileErr) {
        console.error(`Error reading PDF file at ${resume.pdf}:`, fileErr);
        return { ...resume, pdf: null, error: fileErr.message };
      }
    });
    res.json(resumes);
  } catch (err) {
    console.error("Error retrieving resumes:", err);
    res.status(500).json({ error: "Error retrieving resumes", details: err.message });
  }
};



exports.deleteResume = async (req, res) => {
  try {
    const resumeId = req.params.id;
    await resumeModel.deleteResume(resumeId);
    res.status(200).send("Resume deleted successfully");
  } catch (err) {
    console.error("Error deleting resume:", err);
    res.status(500).send("Error deleting resume");
  }
};
