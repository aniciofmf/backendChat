const rateLimit = require("express-rate-limit");
const rateLimitRedis = require("rate-limit-redis");

const { redisClient } = require("../modules/redis/redisClient");
const { RATELIMIT_EXPTIME,RATELIMIT_WINDOWMS,RATELIMIT_MAXHITS } = require("../config/config");

const rateLimiter = new rateLimit({
  store: new rateLimitRedis({
    client: redisClient,
    expiry: RATELIMIT_EXPTIME
  }),
  windowMs: RATELIMIT_WINDOWMS,
  max: RATELIMIT_MAXHITS,
  message:
    "Se ha excedido la cantidad de peticiones permitidas, intente en unos minutos",
  keyGenerator: function(req) {
    return req.ip;
  }
});

module.exports = {
    rateLimiter
};