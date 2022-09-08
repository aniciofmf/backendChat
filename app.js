const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const colors = require('colors');
const apiRoutes = require("./routes/apiRoutes");
const apiRoutesAdmin = require("./routes/apiRoutesAdmin");
const { MONGODB_URI, PORT, HOSTNAME } = require("./config/config");
const { rateLimiter } = require("./middleware/rateLimit");
const { logApp } = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

mongoose.Promise = global.Promise;

const app = express();
const router = express.Router();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());

if (process.env.RATELIMIT_ENABLE == "true") app.use("/api/", rateLimiter);

app.use("/api/", router);
app.use("/api/admin", router);

apiRoutes(router);
apiRoutesAdmin(router);

// Error API handling
app.use(errorHandler);

// Invalid Routes
app.all("*", (req, res) => {
  res.status(400).send();
});

// MongoDB & Express Startup
mongoose
  .connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    app
      .listen(PORT, HOSTNAME,function() {
        console.log(colors.cyan.bold(`App Running at http://${HOSTNAME}:${PORT}`));
      })
      .on("error", err => {
        /*const logger = logApp.getLogger("appServer");
        logger.addContext("logName", "appServer");
        logger.debug("Error al iniciar el servicio http", err);*/
      });
  })
  .catch(err => {
    console.log(err);
    /* const logger = logApp.getLogger("appDB");
    logger.addContext("logName", "appDB");
    logger.debug("Error al iniciar el servicio de MongoDB", err);*/
  });
