const AppError = require("../utility/apperror");

const catchUser = require("../utility/catchAsyncUser");

const Tour = require("../model/tourModel");

const getAllTour = catchUser(async (req, res, next) => {
  const data = await Tour.find();

  res.render("overview", {
    data: data,
  });
});

const getOneTour = catchUser(async (req, res, next) => {
  const data = await Tour.findById(req.params.id);
  if (!data) {
    return next(AppError("data not found", 401));
  }
  res.render("tour", {
    tour: data,
  });
});

const login = catchUser(async (req, res, next) => {
  res.render("loginUser");
});

module.exports = {
  getAllTour,
  getOneTour,
  login,
};
