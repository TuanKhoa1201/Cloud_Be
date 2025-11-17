// require('dotenv').config(); // Load environment variables from .env file

// const admin = require('firebase-admin');

// // Construct serviceAccount object from environment variables (keep this here as it's part of app initialization)
// const serviceAccount = {
// 	type: process.env.FIREBASE_TYPE,
// 	project_id: process.env.FIREBASE_PROJECT_ID,
// 	private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
// 	private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Replace escaped newlines
// 	client_email: process.env.FIREBASE_CLIENT_EMAIL,
// 	client_id: process.env.FIREBASE_CLIENT_ID,
// 	auth_uri: process.env.FIREBASE_AUTH_URI,
// 	token_uri: process.env.FIREBASE_TOKEN_URI,
// 	auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
// 	client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
// 	universe_domain: process.env.UNIVERSE_DOMAIN,
// };

// admin.initializeApp({
//   	credential: admin.credential.cert(serviceAccount)
// });

// // Check if admin is initialized
// // console.log(admin);

// module.exports = admin; // Export firebase admin



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
