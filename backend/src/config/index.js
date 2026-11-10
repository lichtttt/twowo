require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME || 'smart_edu',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'smart-edu-secret',
    expires: process.env.JWT_EXPIRES || '7d',
  },
  ai: {
    apiBase: process.env.AI_API_BASE || '',
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || '',
  },
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
};