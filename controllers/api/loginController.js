const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const {
  redisDel,
  redisSet,
  redisGet
} = require("../../modules/redis/redisClient");
const { generateJwtToken } = require("../../utils/jwtToken");
const asyncHandler = require("../../middleware/asyncHandler");

exports.login = asyncHandler(async (req, res, next) => {
  let { user, password } = req.body;

/*  const userTokenRedis = await redisGet(`${user}:userToken`);
  const userChatTokenRedis = await redisGet(`${user}:chatToken`);

  if (userTokenRedis !== null && userChatTokenRedis !== null) {
    return res
      .status(401)
      .send({ message: "Este usuario está actualmente logueado" });
  }*/

  const userRecord = await User.findOne({
    enabled: true,
    $or: [{ email: user }, { user: user }]
  });

  if (!userRecord) {
    return res.status(401).send({ message: "Credenciales inválidas" });
  }

  const passwordValid = bcrypt.compareSync(password, userRecord.password);

  if (passwordValid) {
    const userToken = generateJwtToken({
      uid: userRecord._id,
      id: userRecord.userId,
      username: userRecord.user,
      image: userRecord.image,
      role: "user"
    });

    await redisSet(`${user}:userToken`, userToken);
    await redisSet(`${user}:chatToken`, userRecord.tokens.chatToken);

    userRecord.lastLog = new Date();
    userRecord.tokens.userToken = userToken;
    userRecord.save();

    res.status(200).send({
      id: userRecord._id,
      userId: userRecord.userId,
      username: userRecord.user,
      email: userRecord.email,
      userToken: userToken,
      chatToken: userRecord.tokens.chatToken,
      avatar: userRecord.image
    });
  } else {
    res.status(403).send({ message: "Credenciales inválidas" });
  }
});

exports.logout = asyncHandler(async (req, res, next) => {
  const { username } = req.decoded;

  redisDel(`${username}:userToken`);
  redisDel(`${username}:chatToken`);

  res.status(200).send();
});
