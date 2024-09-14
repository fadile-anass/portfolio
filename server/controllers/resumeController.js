const resumeModel = require('../models/resumeModel');
const fs = require('fs');

exports.createResume = async (req, res) => {
  try {
    const { name, link } = req.body;
    const pdfPath = req.file.path;

    await resumeModel.createResume(name, link, pdfPath);
    res.status(200).send("Resume created successfully");
  } catch (err) {
    console.error("Error creating resume:", err);
    res.status(500).send("Error creating resume");
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const [results] = await resumeModel.getAllResumes();
    const resumes = results.map(resume => {
      const pdfData = fs.readFileSync(resume.pdf);
      return { ...resume, pdf: pdfData };
    });
    res.json(resumes);
  } catch (err) {
    console.error("Error retrieving resumes:", err);
    res.status(500).send("Error retrieving resumes");
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
