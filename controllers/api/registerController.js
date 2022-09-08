const bcrypt = require("bcryptjs");
const uuidv4 = require("uuid/v4");
const mongoose = require("mongoose");
const User = require("../../models/User");
const { HASH_SALT, IMAGE_AVATAR_SIZE } = require("../../config/config");
const { getChatToken } = require("../../modules/streamchat/chatClient");
const { generateJwtToken } = require("../../utils/jwtToken");
const { redisSet } = require("../../modules/redis/redisClient");
const asyncHandler = require("../../middleware/asyncHandler");

exports.register = asyncHandler(async (req, res, next) => {
  let { email, password, user } = req.body;
  
  const DEFAULT_AVATAR = `https://robohash.org/${user}?size=${IMAGE_AVATAR_SIZE}`;

  let _idUser = new mongoose.Types.ObjectId();

  const userId = `${user}-${uuidv4()}`;

  const userChatObject = {
    id: userId,
    name: user,
    image: DEFAULT_AVATAR
  };

  const userToken = generateJwtToken({
    uid: _idUser,
    id: userId,
    username: user,
    image: DEFAULT_AVATAR,
    role: "user"
  });

  const chatUserToken = getChatToken(userChatObject);

  const hashedPassword = await bcrypt.hash(password, HASH_SALT);

  const userRecord = new User({
    _id: _idUser,
    userId: userId,
    email: email,
    user: user,
    role: "user",
    password: hashedPassword,
    image: DEFAULT_AVATAR,
    tokens: {
      userToken: userToken,
      chatToken: chatUserToken
    },
    lastLog: null
  });

  await userRecord.save();

  res.status(200).send({
    id: userRecord._id,
    userId: userId,
    username: user,
    email: email,
    userToken: userToken,
    chatToken: chatUserToken,
    avatar: userRecord.image
  });

  redisSet(`${user}:userToken`, userToken);
  redisSet(`${user}:chatToken`, chatUserToken);
});
