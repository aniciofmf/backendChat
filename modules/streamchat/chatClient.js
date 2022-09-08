const StreamChat = require("stream-chat").StreamChat;
const { STREAM_KEY, STREAM_SECRET,STREAM_CHAT_TIMEOUT } = require("../../config/config");

/* Devuele el token para el usuario del chat */
function getChatToken(userObject) {
  const client = new StreamChat(STREAM_KEY, STREAM_SECRET, {
    timeout: STREAM_CHAT_TIMEOUT
  });

  const token = client.createToken(userObject.id);

  return token;
}

/* Devuele el objeto del chatClient para todas las operaciones recibiendo el token del usuario */
async function getChatClientUser(userObject, token) {
  const client = new StreamChat(STREAM_KEY, STREAM_SECRET, {
    timeout: STREAM_CHAT_TIMEOUT
  });

  await client.setUser(userObject, token);

  return client;
}

module.exports = {
  getChatToken,
  getChatClientUser
};
