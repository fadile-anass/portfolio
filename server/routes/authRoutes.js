const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [body("username").notEmpty(), body("password").isLength({ min: 6 })],
  authController.register
);

router.post(
  "/login",
  [body("username").notEmpty(), body("password").notEmpty()],
  authController.login
);

module.exports = router; 