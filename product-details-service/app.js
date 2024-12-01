const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");

//set up express app
const app = express();

const PORT = config.get("port");

const ServiceLogger = require("./utils/logger");
const logger = new ServiceLogger(config.get("appName"));

// Request logging middleware
const createLoggingMiddleware = require("./middlewares/logging");
app.use(createLoggingMiddleware(logger));

//parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// registering app to eureka server
require("./utils/eurekaClient");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.get("/health", (req, res) => {
    res.status(200).send({
        message: `${config.get("appName")} is up and running`,
    });
});

app.use("/", require("./routes/productDetails.routes"));

// this should be the last route
require("./routes/error.routes")(app);

app.listen(PORT, () => {
    console.log(`${config.get("appName")} is running on PORT ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    process.exit(1);
});

process.on("uncaughtException", (error) => {
    console.error("There was an uncaught error", error);
    process.exit(1);
});

module.exports = app;