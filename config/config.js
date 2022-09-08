const path = require('path');
const fs  = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const privateKey  = fs.readFileSync(path.join(__dirname,'jwtkeys','private.key'), 'utf8');

module.exports = {
    MONGODB_URI: process.env.MONGODB_URI,
    STREAM_KEY: process.env.STREAM_KEY,
    STREAM_SECRET: process.env.STREAM_SECRET,
    PORT: process.env.PORT || 3000,
    HOSTNAME: process.env.HOSTNAME || '127.0.0.1',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    JWT_PRIVATE_KEY: privateKey,
    HASH_SALT: 8,
    STREAM_CHAT_TIMEOUT: process.env.STREAM_CHAT_TIMEOUT || 5000,
    RATELIMIT_EXPTIME:  process.env.RATELIMIT_EXPTIME || 30,
    RATELIMIT_WINDOWMS: process.env.RATELIMIT_WINDOWMS || 5000,
    RATELIMIT_MAXHITS: process.env.RATELIMIT_MAXHITS || 40,
    MAX_LOG_SIZE: process.env.MAX_LOG_SIZE || 1024,
    PATH_LOG: process.env.PATH_LOG || 'logs',
    IMAGE_AVATAR_SIZE: process.env.IMAGE_AVATAR_SIZE || '60x60'
}