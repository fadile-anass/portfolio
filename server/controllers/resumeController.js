const resumeModel = require('../models/resumeModel');
const fs = require('fs');
const path = require('path');

// Determine if we're in a serverless environment
const isServerless = process.env.NODE_ENV === 'production' || process.env.AWS_LAMBDA_FUNCTION_NAME;

exports.createResume = async (req, res) => {
  try {
    const { name, link } = req.body;
    
    // Store the file path
    let pdfPath = req.file.path.replace(/\\/g, '/');
    
    // For serverless environments, we need to read the file and store its content in the database
    if (isServerless) {
      try {
        const pdfData = fs.readFileSync(pdfPath);
        // Store the binary data directly in the database
        await resumeModel.createResumeWithBinary(name, link, pdfData);
        res.status(201).json({ message: "Resume created successfully" });
      } catch (fileErr) {
        console.error("Error reading uploaded PDF:", fileErr);
        res.status(500).json({ error: "Error processing uploaded PDF" });
      }
    } else {
      // For non-serverless environments, store the path
      await resumeModel.createResume(name, link, pdfPath);
      res.status(201).json({ message: "Resume created successfully" });
    }
  } catch (err) {
    console.error("Error creating resume:", err);
    res.status(500).json({ error: "Error creating resume", details: err.message });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const [results] = await resumeModel.getAllResumes();
    const resumes = results.map(resume => {
      try {
        // Check if pdf is already binary data (Buffer)
        if (resume.pdf && Buffer.isBuffer(resume.pdf)) {
          return resume; // Already has binary data, no need to read file
        }
        
        // If pdf is a string (file path), try to read the file
        if (typeof resume.pdf === 'string') {
          // In serverless environments, the file might not exist anymore
          if (isServerless) {
            console.log("Serverless environment detected, PDF path may not be accessible");
            return { ...resume, pdf: null };
          }
          
          const pdfPath = path.join(process.cwd(), resume.pdf);
          
          if (fs.existsSync(pdfPath)) {
            const pdfData = fs.readFileSync(pdfPath);
            return { ...resume, pdf: pdfData };
          } else {
            console.error(`PDF file not found at ${pdfPath}`);
            return { ...resume, pdf: null, debugPath: pdfPath, originalPath: resume.pdf };
          }
        } else {
          console.error(`Invalid PDF data type: ${typeof resume.pdf}`);
          return { ...resume, pdf: null };
        }
      } catch (fileErr) {
        console.error(`Error processing PDF for resume ${resume.id}:`, fileErr);
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