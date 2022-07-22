const User = require("../model/userModel");
const AppError = require("../utility/apperror");

const catchUser = require("../utility/catchAsyncUser");

const jwt = require("jsonwebtoken");

const { promisify } = require("util");

const mail = require("../utility/mail");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const responseFunc = (res, data, statusCode, token) => {
  res.status(statusCode).json({
    status: "succes",
    data: data,
    token,
  });
};

const signup = catchUser(async (req, res, next) => {
  //  1 sign up  qismi yani ma'lumotni bazaga saqlash
  const data = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  console.log(data);
  //  1   tugadi
  // 2 passwordni heshlab saqlash bu qismi  modelda yoziladi Pre funksiyalar bilan
  //2 bajarildi
  // 3 Userga JWT berish
  const token = await jwt.sign({ id: data._id }, process.env.SECRET, {
    expiresIn: process.env.ExpiresIn,
  });
  responseFunc(res, data, 200, token);
});

const login = catchUser(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // 1. email bilan user bor yo'qligini tekshirib olish
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const data = await User.findOne({ email }).select("+password");

  console.log(data);
  if (!data) {
    return next(new AppError("user is not Found", 401));
  }

  const tekshirHashga = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };

  // 2 pasworndni teskhisib olish agar to'g'ri bo'lsa biz userga JWT berish
  if (!tekshirHashga(password, data.password)) {
    return next(new AppError("Password is incorrect", 401));
  }

  const token = await jwt.sign({ id: data._id }, process.env.SECRET, {
    expiresIn: process.env.ExpiresIn,
  });
  responseFunc(res, undefined, 200, token);
});

const protect = async (req, res, next) => {
  //1 tokenni tekshirish
  let token;

  console.log(user.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(token);
  // tokenni tekshirish kerak
  const id = await promisify(jwt.verify)(token, process.env.SECRET);
  if (!id) {
    return next(new AppError("Please log in", 401));
  }
  console.log(id);
  // user bazada bor yo'qligini tekshirib olish
  const user = await User.findById(id.id);

  if (!user) {
    return next(new AppError("User is not found", 401));
  }

  console.log(user);
  req.user = user;
  next();
};

const forgotPassword = catchUser(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(new AppError("email is required", 400));
  }
  console.log("sfkbdss");
  next();
  const user = await User.findOne({ email: email });
  console.log(user);
  if (!user) {
    return next(new AppError("user not found", 403));
  }

  // token yaratish
  const resetToken = await user.resetToken();
  user.save({
    validateBeforeSave: false,
  });

  await mail({
    email: user.email,
    subject: "Password reset token",
    message:
      "you are reset paswordLink is" +
      `    
      <a>${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/resetPassword/${resetToken}.This link expires 10 minutes after it was sent.</a>`,
  });
  res.status("200").json({
    status: "succes",
    message: "send resetpassword email",
  });
});

const resetPassword = catchUser(async (req, res, next) => {
  const token = req.params.token;
  if (!token) {
    return next(new AppError("token not found", 400));
  }
  const hashToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    hashToken: hashToken,
    expiresDate: {
      $gt: Date.now(),
    },
  });

  console.log(user);
  if (!user) {
    return next(new AppError("tokken or expires not", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.hashToken = undefined;
  user.expiresIn = undefined;

  await user.save();

  const newToken = jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.ExpiresIn,
  });

  res.status(202).json({
    status: "sucess",
    message: "Reset password sucessfull",
    token,
  });
});
module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
};
