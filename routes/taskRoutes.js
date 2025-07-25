const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/auth");
const { validateTask } = require("../middleware/validation");

// All task routes require authentication
router.use(authenticateToken);

// CRUD routes
router.post("/", validateTask, TaskController.createTask);
router.get("/", TaskController.getTasks);
router.get("/:id", TaskController.getTask);
router.put("/:id", validateTask, TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

module.exports = router;
