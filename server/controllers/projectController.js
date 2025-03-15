const projectModel = require('../models/projectModel');
const fs = require('fs');

exports.createProject = async (req, res) => {
  try {
    const { title, description, ghlink } = req.body;
    const imgPath = req.file.path;
    const imgData = fs.readFileSync(imgPath);

    await projectModel.createProject(title, description, ghlink, imgData);
    fs.unlinkSync(imgPath);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { title, description, ghlink }
    });
  } catch (err) {
    console.error("Error inserting project:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
      error: err.message
    });
  }
};


exports.getAllProjects = async (req, res) => {
  try {
    const [results] = await projectModel.getAllProjects();
    const projectsWithBase64Images = results.map(project => {
      const base64Image = project.image.toString("base64");
      return { ...project, image: base64Image };
    });
    res.json(projectsWithBase64Images);
  } catch (err) {
    console.error("Error retrieving projects:", err);
    res.status(500).send("Error retrieving projects");
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await projectModel.getProjectById(id);
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send("Project not found");
    }
  } catch (err) {
    console.error("Error retrieving project:", err);
    res.status(500).send("Error retrieving project");
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, description, ghLink } = req.body;
    const projectId = req.params.projectId;

    let imgData;
    if (req.file) {
      const imgPath = req.file.path;
      imgData = fs.readFileSync(imgPath);
      fs.unlinkSync(imgPath);
    }

    // If no new image is provided, get the existing project to keep the current image
    if (!imgData) {
      const [existingProject] = await projectModel.getProjectById(projectId);
      if (existingProject && existingProject.length > 0) {
        imgData = existingProject[0].image;
      }
    }
    await projectModel.updateProject(projectId, title, description, ghLink, imgData);
    res.status(200).json({
      success: true,
      message: "Project updated successfully"
    });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({
      success: false,
      message: "Error updating project",
      error: err.message
    });
  }
};



exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    await projectModel.deleteProject(projectId);
    res.status(200).send("Project deleted successfully");
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).send("Error deleting project");
  }
};
