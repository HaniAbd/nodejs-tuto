// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateRegistration,
  validateLogin,
} = require("../middleware/validation");

// Public routes
router.post("/register", validateRegistration, UserController.register);
router.post("/login", validateLogin, UserController.login);

// Protected routes
router.get("/profile", authenticateToken, UserController.getProfile);
router.get("/all", authenticateToken, UserController.getAllUsers);

module.exports = router;
