// const { v4: uuidv4 } = require("uuid");
// const { eq, and } = require("drizzle-orm");
// const { chats, messages, agentProfiles } = require("../db/schema.js");
// const chatbotURL = require("../config/config.js").config.chatbotAPIUrl;
// const callApi = require("../utils/callApi.js").callApi;
// const db = require("../db/db.js");
// const GEMINI_URL = require("../config/config.js").geminiConfig.url;
// console.log("geminiurl:", GEMINI_URL);
// exports.createChat = async (req, res) => {
//   const { type, query } = req.body;

//   const userId = req.user?.uid;
//   console.log("User ID:", userId);
//   if (!userId) {
//     console.log(req.user);
//     return res.status(401).json({ message: "Unauthorized. User ID missing." });
//   }

//   if (!type || !query) {
//     return res.status(400).json({ message: "Type and query are required." });
//   }

//   try {
//     const chatId = uuidv4();

//     const agentProfile = await db
//       .select()
//       .from(agentProfiles)
//       .where(eq(agentProfiles.name, type))
//       .limit(1);

//     if (agentProfile.length === 0) {
//       return res.status(404).json({ message: "Agent profile not found." });
//     }

//     const profile = agentProfile[0];

//     const tittleGenerated = await callGeminiFlashForPrompt(type, query);
    
//     console.log("Generated title:", tittleGenerated);
//     await db.insert(chats).values({
//       id: chatId,
//       userId: userId,
//       type: type,
//       title: tittleGenerated,
//     });

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "user",
//       content: query,
//     });

//     const response = await callApi(chatbotURL, {
//       query,
//       system_prompt: profile.systemPrompt,
//       es_cloud_id: profile.esCloudId,
//       es_username: profile.esUsername,
//       es_password: profile.esPassword,
//       index: profile.esIndex,
//       his_message: "", // thêm nếu cần
//     });
//     const ans = response;

//     console.log("API response:", response);

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "bot",
//       content: ans,
//     });

//     return res
//       .status(201)
//       .json({ message: "Chat created successfully.", chatId });
//   } catch (error) {
//     console.error("Error creating chat:", error);
//     return res.status(500).json({ message: "Server error." });
//   }
// };

// exports.sendQuestion = async (req, res) => {
//   const chatId = req.params.id;
//   const { query } = req.body;
//   const userId = req.user?.uid;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. User ID missing." });
//   }

//   if (!chatId || !query) {
//     return res.status(400).json({ message: "Chat ID and query are required." });
//   }

//   try {
//     const chat = await db
//       .select()
//       .from(chats)
//       .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
//       .limit(1);

//     if (chat.length === 0) {
//       return res.status(404).json({ message: "Chat not found." });
//     }

//     const chatData = chat[0];

//     const agentProfile = await db
//       .select()
//       .from(agentProfiles)
//       .where(eq(agentProfiles.name, chatData.type))
//       .limit(1);

//     if (agentProfile.length === 0) {
//       return res.status(404).json({ message: "Agent profile not found." });
//     }

//     const profile = agentProfile[0];

//     const msg_list = await fetchOldMessages(chatId);
//     const msg_list_str = msg_list.map((msg) => msg.content).join(" ");

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "user",
//       content: query,
//     });

//     const response = await callApi(chatbotURL, {
//       query,
//       history: msg_list_str,
//       system_prompt: profile.systemPrompt,
//       es_cloud_id: profile.esCloudId,
//       es_username: profile.esUsername,
//       es_password: profile.esPassword,
//       index: profile.esIndex,
//       his_message: msg_list_str, // hoặc "" nếu không muốn truyền lịch sử
//     });

//     const ans = response;

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "bot",
//       content: ans,
//     });

//     return res
//       .status(200)
//       .json({ message: "Query sent successfully.", response });
//   } catch (error) {
//     console.error("Error sending query:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

// exports.getChat = async (req, res) => {
//   const chatId = req.params.id;
//   const userId = req.user?.uid;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. User ID missing." });
//   }

//   if (!chatId) {
//     return res.status(400).json({ message: "Chat ID is required." });
//   }

//   try {
//     const chat = await db
//       .select()
//       .from(chats)
//       .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
//       .limit(1);

//     if (chat.length === 0) {
//       return res.status(404).json({ message: "Chat not found." });
//     }

//     const chatData = chat[0];

//     const messagesData = await db
//       .select()
//       .from(messages)
//       .where(eq(messages.chatId, chatId))
//       .orderBy(messages.timestamp, "asc");

//     const chatResponse = {
//       chatId: chatData.id,
//       user_id: chatData.userId,
//       type: chatData.type,
//       title: chatData.title,
//       created_at: chatData.createdAt,
//       messages: messagesData.map((message) => ({
//         sender: message.sender,
//         message: message.content,
//         created_at: message.timestamp,
//       })),
//     };

//     return res
//       .status(200)
//       .json({ message: "Chat retrieved successfully.", chat: chatResponse });
//   } catch (error) {
//     console.error("Error fetching chat:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

// exports.deleteChat = async (req, res) => {
//   const chatId = req.params.id;
//   const userId = req.user?.uid;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. User ID missing." });
//   }

//   if (!chatId) {
//     return res.status(400).json({ message: "Chat ID is required." });
//   }

//   try {
//     const chat = await db
//       .select()
//       .from(chats)
//       .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))

//       .limit(1);

//     if (chat.length === 0) {
//       return res.status(404).json({ message: "Chat not found." });
//     }

//     await db.delete(messages).where(eq(messages.chatId, chatId));
//     await db.delete(chats).where(eq(chats.id, chatId));

//     return res.status(200).json({ message: "Chat deleted successfully." });
//   } catch (error) {
//     console.error("Error deleting chat:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

// exports.getChatHistory = async (req, res) => {
//   try {
//     const chatbot_type = req.query.chatbot_type;
//     const userId = req.user?.uid;
//     console.log("User ID:", userId);
//     if (!userId) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized. User ID missing." });
//     }

//     console.log("Chatbot type:", chatbot_type);
//     if (!chatbot_type) {
//       return res
//         .status(400)
//         .json({ message: "chatbot_type query parameter is required." });
//     }
//     console.log("Fetching chat history for type:", chatbot_type);

//     const chat_list = await db
//       .select()
//       .from(chats)
//       .where(and(eq(chats.type, chatbot_type), eq(chats.userId, userId)))
//       .orderBy(chats.createdAt, "desc");
//     if (chat_list.length === 0) {
//       return res.status(404).json({ message: "No chat history found." });
//     }

//     const result = chat_list.map((chat) => ({
//       chatId: chat.id,
//       title: chat.title,
//       created_at: chat.createdAt,
//       type: chat.type,
//     }));

//     return res.status(200).json({
//       message: "Chat history retrieved successfully.",
//       chat_list: result,
//     });
//   } catch (error) {
//     console.error("Error getting chat history:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

// // Hàm lấy lịch sử tin nhắn theo chatId
// const fetchOldMessages = async (chatId) => {
//   const messagesData = await db
//     .select()
//     .from(messages)
//     .where(eq(messages.chatId, chatId))
//     .orderBy(messages.timestamp, "asc");
//   return messagesData;
// };

// const callGeminiFlashForPrompt = async (type, query) => {
//   const promptTemplate = `Viết một title ngắn gọn về chủ đề "${type}" với nội dung "${query}". Title phải có chính xác 5 từ, chỉ gồm chữ thường và khoảng trắng, không chứa chữ hoa, số hay ký tự đặc biệt. Chỉ trả về đúng title, không giải thích thêm.`;

//   const generatedText = await callGeminiFlashApi(promptTemplate);

//   return generatedText;
// };

// const GEMINI_URL_FULL = GEMINI_URL;
// console.log("GEMINI_URL_FULL:", GEMINI_URL_FULL);
// const callGeminiFlashApi = async (promptText) => {
//   const res = await fetch(GEMINI_URL_FULL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             {
//               text: promptText,
//             },
//           ],
//         },
//       ],
//     }),
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     throw new Error(`Gemini Flash API error: ${res.status} - ${errorText}`);
//   }

//   const json = await res.json();
//   const content = json.candidates?.[0]?.content || "";
//   const text = content.parts?.[0]?.text || "";
//   return text;
// };




const { v4: uuidv4 } = require("uuid");
const { eq, and } = require("drizzle-orm");
const { chats, messages, agentProfiles } = require("../db/schema.js");
const chatbotURL = require("../config/config.js").config.chatbotAPIUrl;
const callApi = require("../utils/callApi.js").callApi;
const db = require("../db/db.js");
const GEMINI_URL = require("../config/config.js").geminiConfig.url;
console.log("geminiurl:", GEMINI_URL);
// exports.createChat = async (req, res) => {
//   const { type, query } = req.body;

//   const userId = req.user?.uid;
//   console.log("User ID:", userId);
//   if (!userId) {
//     console.log(req.user);
//     return res.status(401).json({ message: "Unauthorized. User ID missing." });
//   }

//   if (!type || !query) {
//     return res.status(400).json({ message: "Type and query are required." });
//   }

//   try {
//     const chatId = uuidv4();

//     const agentProfile = await db
//       .select()
//       .from(agentProfiles)
//       .where(eq(agentProfiles.name, type))
//       .limit(1);

//     if (agentProfile.length === 0) {
//       return res.status(404).json({ message: "Agent profile not found." });
//     }

//     const profile = agentProfile[0];

//     const tittleGenerated = await callGeminiFlashForPrompt(type, query);
    
//     console.log("Generated title:", tittleGenerated);
//     await db.insert(chats).values({
//       id: chatId,
//       userId: userId,
//       type: type,
//       title: tittleGenerated,
//     });

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "user",
//       content: query,
//     });

//     const response = await callApi(chatbotURL, {
//       query,
//       system_prompt: profile.systemPrompt,
//       es_cloud_id: profile.esCloudId,
//       es_username: profile.esUsername,
//       es_password: profile.esPassword,
//       index: profile.esIndex,
//       his_message: "", // thêm nếu cần
//     });
//     const ans = response;

//     console.log("API response:", response);

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "bot",
//       content: ans,
//     });

//     return res
//       .status(201)
//       .json({ message: "Chat created successfully.", chatId });
//   } catch (error) {
//     console.error("Error creating chat:", error);
//     return res.status(500).json({ message: "Server error." });
//   }
// };

exports.createChat = async (req, res) => {
  const { type, query } = req.body;
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID missing." });
  }

  if (!type || !query) {
    return res.status(400).json({ message: "Type and query are required." });
  }

  try {
    const chatId = uuidv4();
    
    const agentProfile = await db
      .select()
      .from(agentProfiles)
      .where(eq(agentProfiles.name, type))
      .limit(1);

    if (agentProfile.length === 0) {
      return res.status(404).json({ message: "Agent profile not found." });
    }

    const profile = agentProfile[0];

    // Gọi API với payload bao gồm 'type', 'query', và 'system_prompt'
    const tittleGenerated = await callApi(chatbotURL, {
      query,
      system_prompt: profile.systemPrompt,
    });

    await db.insert(chats).values({
      id: chatId,
      userId: userId,
      type: type,
      title: tittleGenerated,
    });

    await db.insert(messages).values({
      id: uuidv4(),
      chatId: chatId,
      sender: "user",
      content: query,
    });

    const ans = tittleGenerated;  // Lấy kết quả từ chatbot

    await db.insert(messages).values({
      id: uuidv4(),
      chatId: chatId,
      sender: "bot",
      content: ans,
    });

    return res.status(201).json({ message: "Chat created successfully.", chatId });
  } catch (error) {
    console.error("Error creating chat:", error);
    return res.status(500).json({ message: "Server error." });
  }
};




// exports.sendQuestion = async (req, res) => {
//   const chatId = req.params.id;
//   const { query } = req.body;
//   const userId = req.user?.uid;
//   if (!userId) {
//     return res.status(401).json({ message: "Unauthorized. User ID missing." });
//   }

//   if (!chatId || !query) {
//     return res.status(400).json({ message: "Chat ID and query are required." });
//   }

//   try {
//     const chat = await db
//       .select()
//       .from(chats)
//       .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
//       .limit(1);

//     if (chat.length === 0) {
//       return res.status(404).json({ message: "Chat not found." });
//     }

//     const chatData = chat[0];

//     const agentProfile = await db
//       .select()
//       .from(agentProfiles)
//       .where(eq(agentProfiles.name, chatData.type))
//       .limit(1);

//     if (agentProfile.length === 0) {
//       return res.status(404).json({ message: "Agent profile not found." });
//     }

//     const profile = agentProfile[0];

//     const msg_list = await fetchOldMessages(chatId);
//     const msg_list_str = msg_list.map((msg) => msg.content).join(" ");

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "user",
//       content: query,
//     });

//     const response = await callApi(chatbotURL, {
//       query,
//       history: msg_list_str,
//       system_prompt: profile.systemPrompt,
//       es_cloud_id: profile.esCloudId,
//       es_username: profile.esUsername,
//       es_password: profile.esPassword,
//       index: profile.esIndex,
//       his_message: msg_list_str, // hoặc "" nếu không muốn truyền lịch sử
//     });

//     const ans = response;

//     await db.insert(messages).values({
//       id: uuidv4(),
//       chatId: chatId,
//       sender: "bot",
//       content: ans,
//     });

//     return res
//       .status(200)
//       .json({ message: "Query sent successfully.", response });
//   } catch (error) {
//     console.error("Error sending query:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };


exports.sendQuestion = async (req, res) => {
  const chatId = req.params.id;
  const { query } = req.body;
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID missing." });
  }

  if (!chatId || !query) {
    return res.status(400).json({ message: "Chat ID and query are required." });
  }

  try {
    const chat = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .limit(1);

    if (chat.length === 0) {
      return res.status(404).json({ message: "Chat not found." });
    }

    const chatData = chat[0];

    const agentProfile = await db
      .select()
      .from(agentProfiles)
      .where(eq(agentProfiles.name, chatData.type))
      .limit(1);

    if (agentProfile.length === 0) {
      return res.status(404).json({ message: "Agent profile not found." });
    }

    const profile = agentProfile[0];

    const msg_list = await fetchOldMessages(chatId);
    const msg_list_str = msg_list.map((msg) => msg.content).join(" ");

    await db.insert(messages).values({
      id: uuidv4(),
      chatId: chatId,
      sender: "user",
      content: query,
    });

    // Gọi API chatbot thay vì Elasticsearch
    const response = await callApi(chatbotURL, {
      query,
      history: msg_list_str,
      system_prompt: profile.systemPrompt,
    });

    const ans = response;

    await db.insert(messages).values({
      id: uuidv4(),
      chatId: chatId,
      sender: "bot",
      content: ans,
    });

    return res.status(200).json({ message: "Query sent successfully.", response });
  } catch (error) {
    console.error("Error sending query:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


exports.getChat = async (req, res) => {
  const chatId = req.params.id;
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID missing." });
  }

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required." });
  }

  try {
    const chat = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
      .limit(1);

    if (chat.length === 0) {
      return res.status(404).json({ message: "Chat not found." });
    }

    const chatData = chat[0];

    const messagesData = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.timestamp, "asc");

    const chatResponse = {
      chatId: chatData.id,
      user_id: chatData.userId,
      type: chatData.type,
      title: chatData.title,
      created_at: chatData.createdAt,
      messages: messagesData.map((message) => ({
        sender: message.sender,
        message: message.content,
        created_at: message.timestamp,
      })),
    };

    return res
      .status(200)
      .json({ message: "Chat retrieved successfully.", chat: chatResponse });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.deleteChat = async (req, res) => {
  const chatId = req.params.id;
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User ID missing." });
  }

  if (!chatId) {
    return res.status(400).json({ message: "Chat ID is required." });
  }

  try {
    const chat = await db
      .select()
      .from(chats)
      .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))

      .limit(1);

    if (chat.length === 0) {
      return res.status(404).json({ message: "Chat not found." });
    }

    await db.delete(messages).where(eq(messages.chatId, chatId));
    await db.delete(chats).where(eq(chats.id, chatId));

    return res.status(200).json({ message: "Chat deleted successfully." });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const chatbot_type = req.query.chatbot_type;
    const userId = req.user?.uid;
    console.log("User ID:", userId);
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. User ID missing." });
    }

    console.log("Chatbot type:", chatbot_type);
    if (!chatbot_type) {
      return res
        .status(400)
        .json({ message: "chatbot_type query parameter is required." });
    }
    console.log("Fetching chat history for type:", chatbot_type);

    const chat_list = await db
      .select()
      .from(chats)
      .where(and(eq(chats.type, chatbot_type), eq(chats.userId, userId)))
      .orderBy(chats.createdAt, "desc");
    if (chat_list.length === 0) {
      return res.status(404).json({ message: "No chat history found." });
    }

    const result = chat_list.map((chat) => ({
      chatId: chat.id,
      title: chat.title,
      created_at: chat.createdAt,
      type: chat.type,
    }));

    return res.status(200).json({
      message: "Chat history retrieved successfully.",
      chat_list: result,
    });
  } catch (error) {
    console.error("Error getting chat history:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Hàm lấy lịch sử tin nhắn theo chatId
const fetchOldMessages = async (chatId) => {
  const messagesData = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.timestamp, "asc");
  return messagesData;
};

const callGeminiFlashForPrompt = async (type, query) => {
  const promptTemplate = `Viết một title ngắn gọn về chủ đề "${type}" với nội dung "${query}". Title phải có chính xác 5 từ, chỉ gồm chữ thường và khoảng trắng, không chứa chữ hoa, số hay ký tự đặc biệt. Chỉ trả về đúng title, không giải thích thêm.`;

  const generatedText = await callGeminiFlashApi(promptTemplate);

  return generatedText;
};

const GEMINI_URL_FULL = GEMINI_URL;
console.log("GEMINI_URL_FULL:", GEMINI_URL_FULL);
const callGeminiFlashApi = async (promptText) => {
  const res = await fetch(GEMINI_URL_FULL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini Flash API error: ${res.status} - ${errorText}`);
  }

  const json = await res.json();
  const content = json.candidates?.[0]?.content || "";
  const text = content.parts?.[0]?.text || "";
  return text;
};
