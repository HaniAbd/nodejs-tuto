// models/Task.js
const pool = require("../configs/database");

class Task {
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        priority VARCHAR(10) DEFAULT 'medium',
        status VARCHAR(20) DEFAULT 'pending',
        due_date TIMESTAMP,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await pool.query(query);
      console.log("Tasks table created successfully");
    } catch (error) {
      console.error("Error creating tasks table:", error);
    }
  }

  static async create(taskData, userId) {
    const { title, description, priority, dueDate } = taskData;

    const query = `
      INSERT INTO tasks (title, description, priority, due_date, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        title,
        description,
        priority,
        dueDate,
        userId,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId, filters = {}) {
    let query = "SELECT * FROM tasks WHERE user_id = $1";
    const params = [userId];
    let paramCount = 1;

    // Add filters
    if (filters.status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
    }

    if (filters.priority) {
      paramCount++;
      query += ` AND priority = $${paramCount}`;
      params.push(filters.priority);
    }

    query += " ORDER BY created_at DESC";

    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id, userId) {
    const query = "SELECT * FROM tasks WHERE id = $1 AND user_id = $2";

    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userId, updateData) {
    const { title, description, priority, status, dueDate } = updateData;

    const query = `
      UPDATE tasks 
      SET title = $1, description = $2, priority = $3, status = $4, 
          due_date = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND user_id = $7
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        title,
        description,
        priority,
        status,
        dueDate,
        id,
        userId,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    const query =
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *";

    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Task;
