const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/config");
const { redisGet } = require("../modules/redis/redisClient");

module.exports = (req, res, next) => {
  let header = req.headers["authorization"];

  try {
    if (typeof header !== "undefined") {
      let token = header.split(" ")[1];

      jwt.verify(
        token,
        JWT_PRIVATE_KEY,
        { ignoreExpiration: true },
        async (err, auth) => {
          if (err) return res.status(403).send({ message: "Token inválido" });

          req.decoded = jwt.decode(token);
          const tokenValid = await redisGet(
            `${req.decoded.username}:userToken`
          );

          if (tokenValid) {
            next();
          } else {
            return res.status(403).send({ message: "Token inválido" });
          }
        }
      );
    } else {
      return res.status(403).send({ message: "El token es obligatorio" });
    }
  } catch (e) {
    const error = new Error(e);
    error.httpStatusCode = 500;
    return next(error);
  }
};
