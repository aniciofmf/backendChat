const log4js = require("log4js");
const path = require("path");
const { MAX_LOG_SIZE,PATH_LOG } = require("../config/config");

// NOTE: for PM2 support to work you'll need to install the pm2-intercom module
// `pm2 install pm2-intercom`
const logApp = log4js.configure({
  appenders: {
    multi: {
      type: "multiFile",
      base: path.join(__dirname, "..", PATH_LOG),
      property: "logName",
      extension: ".log",
      maxLogSize: MAX_LOG_SIZE,
      backups: 1,
      compress: true
    }
  },
  categories: {
    default: { appenders: ["multi"], level: "debug" }
  },
  pm2: true
});

module.exports = {
  logApp
};
