const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Render, the DATABASE_URL is automatically set
  // For local development, use: postgresql://user:password@localhost:5432/portfolio
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize Database Table
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Database table initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Test Connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// REST API Route to Handle Contact Form Submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Save to database
    const query = `
      INSERT INTO messages (name, email, message)
      VALUES ($1, $2, $3)
      RETURNING id, timestamp
    `;
    const result = await pool.query(query, [name, email, message]);

    console.log("✓ New message saved:", { name, email, id: result.rows[0].id });
    res.status(201).json({
      success: true,
      message: 'Message saved successfully!',
      id: result.rows[0].id
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ success: false, error: 'Failed to save message' });
  }
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Serve static files from frontend folder
app.use(express.static('../frontend'));

// Start the server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
  await initializeDatabase();
  console.log('✓ Connected to PostgreSQL');
});

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Connection pool closed');
    process.exit(0);
  });
});

