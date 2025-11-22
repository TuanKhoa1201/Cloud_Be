exports.callApi = async (url, data) => {
  try {
    // Kiểm tra xem tất cả các tham số có đầy đủ không
    if (!data.query || !data.system_prompt || !data.es_cloud_id || !data.es_username || !data.es_password || !data.index) {
      throw new Error("Thiếu tham số bắt buộc");
    }

    const queryString = new URLSearchParams(data).toString();  // Chuyển các tham số thành query string
    const fullUrl = `${url}?${queryString}`;  // Kết hợp URL với các tham số

    // In ra URL để kiểm tra
    console.log("Request URL:", fullUrl);

    const response = await fetch(fullUrl, {
      method: "GET",  // Phương thức HTTP GET
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return result;  // Trả về kết quả nhận được từ API

  } catch (error) {
    console.error("Error calling API:", error);
    throw error;
  }
};
