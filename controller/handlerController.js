const AppError = require("../utility/apperror");
const catchAsync = require("../utility/catchAsync");
const FeatureApi = require("../utility/fetaureApi");

const responseFunc = (res, data, statusCode) => {
  res.status(statusCode).json({
    status: "succes",
    data: data,
  });
};

const getAll = catchAsync(async (req, res, next, Model, option) => {
  let data = new FeatureApi(req.query, Model)
    .filter()
    .sort()
    .field()
    .pagenation();

  data = await data.databaseQuery.populate("reviews");
  // const data = await Model.find().populate(option);
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  console.log("get all handlga kirdi");
  responseFunc(res, data, 200);
});

const getOne = catchAsync(async (req, res, next, Model) => {
  const data = await Model.findById(req.params.id).populate("reviews");
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  responseFunc(res, data, 200);
});

const add = catchAsync(async (req, res, next, Model) => {
  const data = await Model.create(req.body);
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  responseFunc(res, data, 201);
});
const update = catchAsync(async (req, res, next, Model) => {
  const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  responseFunc(res, data, 202);
});

const deleteData = catchAsync(async (req, res, next, Model) => {
  const data = await Model.findByIdAndRemove(req.params.id);
  if (!data) {
    return next(new AppError("No data found", 404));
  }
  responseFunc(res, data, 204);
});

const addTour = 0;

module.exports = { getAll, getOne, add, update, deleteData };
