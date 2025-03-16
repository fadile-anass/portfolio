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
        // Normalize the file path to work across different operating systems
        const normalizedPath = path.resolve(resume.pdf.replace(/\\/g, path.sep));
        
        // Check if file exists before trying to read it
        if (fs.existsSync(normalizedPath)) {
          const pdfData = fs.readFileSync(normalizedPath);
          return { ...resume, pdf: pdfData };
        } else {
          console.error(`PDF file not found at ${normalizedPath}`);
          return { ...resume, pdf: null };
        }
      } catch (fileErr) {
        console.error(`Error reading PDF file at ${resume.pdf}:`, fileErr);
        return { ...resume, pdf: null };
      }
    });
    res.json(resumes);
  } catch (err) {
    console.error("Error retrieving resumes:", err);
    res.status(500).json({ error: "Error retrieving resumes" });
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