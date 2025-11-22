// exports.callApi = async (url, data) => {
//   try {
//     const queryString = new URLSearchParams(data).toString();
//     const fullUrl = `${url}?${queryString}`;

//     const response = await fetch(fullUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       // Lấy response body dạng text để debug
//       const errorText = await response.text();
//       throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//     }

//     const result = await response.json();
//     return result;

//   } catch (error) {
//     console.error("Error calling API:", error);
//     throw error;
//   }
// };





// exports.callApi = async (url, data) => {
//   try {
//     const queryString = new URLSearchParams(data).toString();
//     const fullUrl = `${url}?${queryString}`;

//     const response = await fetch(fullUrl, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       // Lấy response body dạng text để debug
//       const errorText = await response.text();
//       throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
//     }

//     const result = await response.json();
//     return result;

//   } catch (error) {
//     console.error("Error calling API:", error);
//     throw error;
//   }
// };


const callApi = async (chatbotURL, payload) => {
  try {
    const response = await fetch(chatbotURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Cung cấp model
        messages: [
          {
            role: "system",  // Tin nhắn hệ thống (có thể là mô tả về nhiệm vụ của bot)
            content: payload.system_prompt || "You are a helpful assistant." // Cung cấp nội dung hệ thống nếu có
          },
          {
            role: "user",  // Tin nhắn của người dùng
            content: payload.query  // Cung cấp câu hỏi của người dùng
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Error calling chatbot API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content || "No response from chatbot"; // Trả về kết quả từ chatbot
  } catch (error) {
    console.error("Error calling chatbot API:", error);
    throw error;
  }
};
module.exports = { callApi };
