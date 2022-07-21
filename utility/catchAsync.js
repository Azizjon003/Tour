const AppError = require("./apperror");

const catchAsync = (funksiya) => {
  const ishlaFunct = async (req, res, next, Model) => {
    await funksiya(req, res, next, Model).catch((err) => {
      next(new AppError(err.message, err.statusCode));
    });
  };

  return ishlaFunct;
};

module.exports = catchAsync;
