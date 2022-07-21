const express = require("express");

const Router = require("../routes/toursRoute");
const userRouter = require("../routes/userRoute");
const errorHandler = require("../controller/errorHandler");

const app = express();
const AppError = require("../utility/apperror");
const morgan = require("morgan");
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/v1/tours", Router);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  next(new AppError("Not found", 404));
});

app.use(errorHandler);
module.exports = app;
