// // require('dotenv').config(); // Load environment variables from .env file
// // dotenv.config(); // Load environment variables from .env file

// const mysqlUrl  = process.env.MYSQL_URL || 'mysql://root:password@localhost:3306/mydb'
// const chatbotAPIUrl = process.env.CHATBOT_API_URL || 'http://localhost:5000/api/chatbot'
// const GEMINI_URL = process.env.GEMINI_URL || 'https://api.gemini.com/v1/flash'
// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Convert port to number, default to 3306
//   waitForConnections: true, // Whether to wait for connections to become available
//   connectionLimit: 10,     // Max number of connections in the pool
//   queueLimit: 0            // No limit on connection queue
// };

// const config = {
//     mysqlUrl: mysqlUrl,
//     chatbotAPIUrl: chatbotAPIUrl,
// }

// const geminiConfig = {
//     url: GEMINI_URL,
// }

// module.exports = { dbConfig, config, geminiConfig };




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
  chatbotAPIUrl: process.env.CHATBOT_API_URL || "http://localhost:5000/api/chatbot"
};


// ================== GEMINI CONFIG ==================
const geminiConfig = {
  url: process.env.GEMINI_URL || "https://api.gemini.com/v1/flash"
};

module.exports = { dbConfig, config, geminiConfig };
