const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'https://playground.julius.ai/api/temp_user_id',
  headers: { }
};

axios.request(config)
.then((response) => {
let data = JSON.stringify({
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://playground.julius.ai/api/chat/start',
  headers: { 
    'content-type': 'application/json', 
    'is-demo': `${response.data.temp_user_id}`, 
  },
  data : data
};

axios.request(config)
.then((response) => {
    let data = JSON.stringify({
      "message": {
        "content": "bye"
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
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://playground.julius.ai/api/chat/message',
      headers: { 
        'content-type': 'application/json', 
        'conversation-id': '6bb95310-9da1-44a8-bfc1-f50588bf4561', 
        'is-demo': `${response.data.user_id}`, 
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
})
.catch((error) => {
  console.log(error);
});

})
.catch((error) => {
  console.log(error);
});

