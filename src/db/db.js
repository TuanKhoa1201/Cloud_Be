const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise");

// Lấy connection string từ biến môi trường
const dbConfig = process.env.MYSQL_CONNECTION_STRING;

// Tạo kết nối với MySQL sử dụng connection string và cấu hình SSL
const pool = mysql.createPool({
  uri: dbConfig, // Sử dụng connection string lấy từ môi trường
  waitForConnections: true,
  ssl: {
    rejectUnauthorized: true // Đảm bảo SSL được sử dụng và chứng chỉ của máy chủ được xác thực
  }
});

const db = drizzle(pool);

// Kiểm tra kết nối đến cơ sở dữ liệu
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database using mysql2 pool!');
        connection.release(); // Giải phóng kết nối về pool
    })
    .catch(err => {
        console.error('Error connecting to MySQL database:', err.message);
        // Xử lý lỗi kết nối
        // process.exit(1);
    });

// Xuất db để sử dụng trong các file khác
module.exports = db;
