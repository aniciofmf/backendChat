const redis = require("redis");
const { REDIS_PORT, REDIS_HOST } = require("../../config/config");

const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });

redisClient.on("error", function (err) {
  console.log("Error al iniciar el servicio de Redis ", err);
  process.exit();
});

var redisGet = key => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

var redisSet = (key, val) => {
  return new Promise((resolve, reject) => {
    redisClient.set(key, val, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

var redisDel = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports = {
  redisClient,
  redisGet,
  redisSet,
  redisDel,
  redisClient
};
