const AppError = require("./apperror");

const catchUser = (funksiya) => {
  const func = async (req, res, next) => {
    await funksiya(req, res, next).catch((err) => {
      return next(new AppError(err.message, err.statusCode));
    });
  };
  return func;
};

module.exports = catchUser;
