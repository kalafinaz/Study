const axios = require('axios');
const startChat = async () => {
  try {
    const userResponse = await axios.get('https://playground.julius.ai/api/temp_user_id');
    const tempUserId = userResponse.data.temp_user_id;

    const chatResponse = await axios.post('https://playground.julius.ai/api/chat/start', {}, {
      headers: {
        'content-type': 'application/json', 
    'is-demo': tempUserId, 
      },
      maxBodyLength: Infinity,
    });

    const userId = chatResponse.data.user_id;
    const messageData = {
      "message": {
        "content": "hi"
      },
      "provider": "default",
      "chat_mode": "auto",
      "client_version": "20240130",
      "theme": "light",
      "new_images": null,
      "new_attachments": null,
      "dataframe_format": "json",
      "selectedModels": [
        "GPT-4o mini"
      ]
    };

    const messageResponse = await axios.post('https://playground.julius.ai/api/chat/message',messageData,{
      headers: { 
        'content-type': 'application/json', 
        'conversation-id': '6bb95310-9da1-44a8-bfc1-f50588bf4561', 
        'is-demo':userId, 
      },
      maxBodyLength: Infinity,
    });

    console.log(messageResponse.data);
    
  } catch (error) {
    console.error('error', error);
  }
};

startChat();