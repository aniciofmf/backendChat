const StreamChat = require("stream-chat").StreamChat;
const { STREAM_KEY, STREAM_SECRET } = require("../../config/config");

exports.updateRole = async (req, res, next) => {
  try {
    let { id } = req.decoded;
    let { role } = req.body;

    const client = new StreamChat(STREAM_KEY, STREAM_SECRET);

    await client.updateUser({
      id: id,
      role: role
    });

    res.status(200).send({ ok: "ok" });
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};


exports.userState = async (req, res, next) => {
  try {
    let { userId } = req.body;

    const client = new StreamChat(STREAM_KEY, STREAM_SECRET);

    const response = await client.queryUsers({ id: { $in: [userId] } });

    res.status(200).send(response);
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};