const { validationResult } = require("express-validator");

class TaskController {
  static async createTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const userId = req.user.userId;
      const task = await Task.create(req.body, userId);

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: { task },
      });
    } catch (error) {
      console.error("Create task error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getTasks(req, res) {
    try {
      const userId = req.user.userId;
      const filters = {
        status: req.query.status,
        priority: req.query.priority,
      };

      const tasks = await Task.findByUserId(userId, filters);

      res.json({
        success: true,
        data: {
          tasks,
          count: tasks.length,
        },
      });
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async getTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const task = await Task.findById(id, userId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        data: { task },
      });
    } catch (error) {
      console.error("Get task error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async updateTask(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { id } = req.params;
      const userId = req.user.userId;

      const task = await Task.update(id, userId, req.body);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        message: "Task updated successfully",
        data: { task },
      });
    } catch (error) {
      console.error("Update task error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const task = await Task.delete(id, userId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      res.json({
        success: true,
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = TaskController;
