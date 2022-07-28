const AppError = require("../utility/apperror");
const Review = require("../model/review");
const getAllReview = async (req, res, next) => {
  let filter = {};
  if (req.params.tourid) filter = { tour: req.params.tourid };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: "succes",
    reviews,
  });
};

const addReview = async (req, res, next) => {
  console.log(req.params);
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user._id;
  console.log(req.body);
  const reviews = await Review.create(req.body);
  if (!reviews) {
    return next(new AppError("items is required", 300));
  }
  res.status(200).json({
    status: "succes",
    reviews,
  });
};

module.exports = {
  addReview,
  getAllReview,
};
