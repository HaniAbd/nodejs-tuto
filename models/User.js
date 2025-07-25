const pool = require("../configs/database");
const bcrypt = require("bcrypt");

class User {
  constructor(id, email, username, password, createdAt) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.createdAt = createdAt;
  }

  // Create user table (run this once)
  static async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      await pool.query(query);
      console.log("Users table created successfully");
    } catch (error) {
      console.error("Error creating users table:", error);
    }
  }

  // Create a new user
  static async create(userData) {
    const { email, username, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, username, password)
      VALUES ($1, $2, $3)
      RETURNING id, email, username, created_at
    `;

    try {
      const result = await pool.query(query, [email, username, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query =
      "SELECT id, email, username, created_at FROM users WHERE id = $1";

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  static async findAll() {
    const query =
      "SELECT id, email, username, created_at FROM users ORDER BY created_at DESC";

    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
