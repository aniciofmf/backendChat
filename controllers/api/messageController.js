exports.createMessage = async (req, res, next) => {
  try {
    const { channelId, message } = req.body;
    const { id, username } = req.decoded;

    const channel = req.chatClient.channel("messaging", channelId);

    let messageResponse;

    messageResponse = await channel.sendMessage({
      text: message,
      user: { id: id, username: username }
    });

    res.status(200).send({ messageResponse });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};
