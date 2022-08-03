const express = require("express");

const Router = require("../routes/toursRoute");
const userRouter = require("../routes/userRoute");
const errorHandler = require("../controller/errorHandler");
const viewRouter = require("../routes/viewRoutes");
const reviewRouter = require("../routes/review");
const langRouter = require("../routes/langRoute");
const app = express();
const rateLimit = require("express-rate-limit");
const halmet = require("helmet");
const cookie = require("cookie-parser");
// const dataSanitize =require("expres-mongo-sanitize");
const xssClean = require("xss-clean");
const AppError = require("../utility/apperror");
const morgan = require("morgan");

const path = require("path");
const limitter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "This IP to many requests",
});

app.use(halmet());

app.use("/api", limitter);

app.use(morgan("dev"));

app.use(
  express.json({
    limit: "20kb",
  })
);
app.use(cookie());
app.use(express.urlencoded({ limit: "10kb" }));

app.set("view engine", "pug");

app.set("views", path.join(__dirname, "../views"));
// app.use(dataSanitize());

app.use(xssClean());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1/lang", langRouter);
app.use("/api/v1/tours", Router);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/", viewRouter);
app.all("*", (req, res, next) => {
  next(new AppError("Not found", 404));
});

app.use(errorHandler);
module.exports = app;
