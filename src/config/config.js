// Load environment variables
require('dotenv').config();

// ================== DATABASE CONFIG ==================
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cloud",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// ================== CHATBOT API CONFIG ==================
const config = {
  mysqlUrl: process.env.MYSQL_URL || "mysql://root:password@localhost:3306/mydb",
  chatbotAPIUrl: process.env.CHATBOT_API_URL || "https://agent-container.wonderfulcliff-cfc4a5e5.westus2.azurecontainerapps.io/get-ai-response"
};


// ================== GEMINI CONFIG ==================
const geminiConfig = {
  url: process.env.GEMINI_URL || "https://api.gemini.com/v1/flash"
};

module.exports = { dbConfig, config, geminiConfig };
