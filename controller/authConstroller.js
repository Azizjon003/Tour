const User = require("../model/userModel");
const AppError = require("../utility/apperror");

const catchUser = require("../utility/catchAsyncUser");

const jwt = require("jsonwebtoken");

const { promisify } = require("util");

const mail = require("../utility/mail");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");
const multer = require("multer");
const sharp = require("sharp");

const responseFunc = (res, data, statusCode, token) => {
  res.status(statusCode).json({
    status: "succes",
    data: data,
    token,
  });
};

const saveTokenCookie = (res, token, req) => {
  // shu cookieni ishlashini sorimiz
  res.cookie("jwt", token, {
    maxAge: 10 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: req.protocol === "https" ? true : false,
  });
};
const tekshirHashga = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
const OptionSort = function (options, permission) {
  const option = {};
  console.log(permission);
  Object.keys(options).forEach((key) => {
    if (permission.includes(key)) option[key] = options[key];
  });

  return option;
};

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/img/users/");
//   },
//   filename: (req, file, cb) => {
//     // user-user_id-timestemp
//     const fileFormat = file.mimetype.split("/")[1];
//     const filename = `user-${req.user.id}-${Date.now()}.${fileFormat}`;
//     cb(null, filename);
//   },
// });

const multerStorage = multer.memoryStorage({});
const filterImage = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("rasm faylini yuklang", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: filterImage,
});
const uploadImg = upload.single("photo");

const resizeImg = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  const fileFormat = req.file.mimetype.split("/")[1];
  req.file.filename = `user-${req.user.id}-${Date.now()}.${fileFormat}`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .toFile(`${__dirname}/../public/img/users/${req.file.filename}`);

  next();
};
const signup = catchUser(async (req, res, next) => {
  //  1 sign up  qismi yani ma'lumotni bazaga saqlash
  const data = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  console.log(data);
  //  1   tugadi
  // 2 passwordni heshlab saqlash bu qismi  modelda yoziladi Pre funksiyalar bilan
  //2 bajarildi
  // 3 Userga JWT berish
  const token = await jwt.sign({ id: data._id }, process.env.SECRET, {
    expiresIn: process.env.ExpiresIn,
  });
  const url = `localhost:8080/home`;
  await new mail(data, url).sentWelcome();

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
  console.log("asndas");
  console.log(data);
  if (!data) {
    return next(new AppError("user is not Found", 401));
  }

  console.log(await tekshirHashga(password, data.password));
  // 2 pasworndni teskhisib olish agar to'g'ri bo'lsa biz userga JWT berish
  if (!(await tekshirHashga(password, data.password))) {
    console.log("sdnsd");
    return next(new AppError("Password is incorrect", 401));
  }

  const token = await jwt.sign({ id: data._id }, process.env.SECRET, {
    expiresIn: process.env.ExpiresIn,
  });
  saveTokenCookie(res, token, req);
  responseFunc(res, undefined, 200, token);
});

const protect = catchUser(async (req, res, next) => {
  //1 tokenni tekshirish
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  }

  // tokenni tekshirish kerak
  const id = await promisify(jwt.verify)(token, process.env.SECRET);
  if (!id) {
    return next(new AppError("Please log in", 401));
  }
  console.log(id);
  // user bazada bor yo'qligini tekshirib olish
  const user = await User.findById(id.id);

  console.log(user);
  console.log(!user);
  if (!user) {
    return next(new AppError("User is not found", 401));
  }

  // if (id.ieat < user.passwordChangedAt.getTime() / 1000) {
  //   return next(new AppError("jwt malformet", 401));
  // }
  req.user = user;
  res.locals.user = user;
  next();
});

const forgotPassword = catchUser(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    return next(new AppError("email is required", 400));
  }
  console.log("sfkbdss");
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
  res.status(200).json({
    status: "sucess",
    message: "send email  reset token ",
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
    token: newToken,
  });
});

const updatePassword = catchUser(async (req, res, next) => {
  const currentpass = req.body.currentPassword;

  const user = await User.findById(req.user.id).select("+password");
  console.log("asdas");
  console.log(user);
  if (!(await tekshirHashga(currentpass, user.password))) {
    return next(new AppError("current password is incorrect", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();

  res.cookie("jwt", "logout", {
    httpOnly: true,
  });
  responseFunc(res, undefined, 200);
});

const updateMe = catchUser(async (req, res, next) => {
  const id = req.user._id;
  const optionPermission = ["name", "email", "photo"];
  let option = {};
  option.name = req.body.name || req.user.name;
  option.email = req.body.email || req.user.email;
  option.photo = req.file?.filename || req.user.photo;

  const options = OptionSort(option, optionPermission);

  const user = await User.findByIdAndUpdate(id, options, {
    new: true,
    runValidators: true,
  });

  responseFunc(res, user, 200);
});

const deleteUser = catchUser(async (req, res, next) => {
  console.log(req.user);
  const deleteData = await User.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  responseFunc(res, null, 204);
});
const role = (roles) => {
  return catchUser(async (req, res, next) => {
    if (!role.include(user.role)) {
      return next(new AppError("xato bu huquqga ega emassiz", 401));
    }

    next();
  });
};

const isSignin = catchUser(async (req, res, next) => {
  let token;
  console.log(req.cookies);
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!req.cookies.jwt || req.cookies.jwt == "logout") {
    return next();
  }

  console.log(token);
  // tokenni tekshirish kerak
  const id = await promisify(jwt.verify)(token, process.env.SECRET);
  if (!id) {
    console.log("sana");
    return next();
  }
  // user bazada bor yo'qligini tekshirib olish

  const user = await User.findById(id.id);

  if (!user) {
    return next();
  }
  res.locals.user = user;
  return next();
});
const logout = (req, res, next) => {
  console.log("logotga kirdi");
  res.cookie("jwt", "logout", {
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
module.exports = {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteUser,
  role,
  isSignin,
  logout,
  uploadImg,
  resizeImg,
};
