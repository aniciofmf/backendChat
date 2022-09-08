const jwt = require("jsonwebtoken");
const { redisGet } = require("../../redis/redisClient");

module.exports = async (req, res, next) => {
  let header = req.headers["x-chat-token"];

  try {
    if (typeof header !== "undefined") {
      let token = header.split(" ")[0];

      if (token) {

        req.chatToken = token;

        const chatTokenDecoded = jwt.decode(token);

        if (chatTokenDecoded.user_id !== req.decoded.id) {
          return res.status(403).send({ message: "Los tokens no coinciden" });
        }

        const tokenValid = await redisGet(`${req.decoded.username}:chatToken`);

        if (!tokenValid) {
          return res.status(403).send({ message: "Token Inválido" });
        }

        next();
      } else {
        return res.status(403).send({ message: "El token es obligatorio" });
      }
    } else {
      return res.status(403).send({ message: "El token es obligatorio" });
    }
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};
