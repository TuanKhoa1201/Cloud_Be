require('dotenv').config(); // Load environment variables from .env file

const admin = require('firebase-admin');
const path = require('path'); // Module để xử lý đường dẫn tệp

// Đảm bảo tệp serviceAccountKey.json được thêm vào dự án (không đẩy lên GitHub)
// Sử dụng đường dẫn tuyệt đối tới tệp JSON tài khoản dịch vụ
const serviceAccount = path.join(__dirname, 'serviceAccountKey.json'); // Đảm bảo đường dẫn tới tệp JSON đúng

// Khởi tạo Firebase Admin với tệp JSON
admin.initializeApp({
  	credential: admin.credential.cert(serviceAccount),
  	databaseURL: "https://cloud-69b36.firebaseio.com" // Thay thế với URL Firebase của bạn
});

// Kiểm tra nếu Firebase Admin được khởi tạo thành công
// console.log(admin);

module.exports = admin; // Export firebase admin
