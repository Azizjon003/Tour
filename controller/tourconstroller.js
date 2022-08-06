const hand = require("./handlerController");
const Tours = require("../model/tourModel");
const { promisify } = require("util");

const catchAsyncUser = require("../utility/catchAsyncUser");

const multer = require("multer");
const sharp = require("sharp");
const option = {
  path: "guides",
  select: "-__v -passwordChangedAt -_id",
};
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

const uploadTourImages = upload.fields([
  {
    name: "ImageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 3,
  },
]);
const resizeImg = catchAsyncUser(async (req, res, next) => {
  if (req.files.ImageCover) {
    const fileFormat = req.files.ImageCover[0].mimetype.split("/")[1];
    req.body.imageCover = `user-${req.user.id}-${Date.now()}.${fileFormat}`;
    console.log(req.body.imageCover);
    await sharp(req.files.ImageCover[0].buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${__dirname}/../public/img/${req.body.imageCover}`);
  }
  if (req.files.images) {
    req.body.images = [];

    req.files.images.map((val, key) => {
      let imageName = `tour-${req.user.id}-${Date.now()}-${key}.${
        val.mimetype.split("/")[1]
      }`;
      req.body.images.push(imageName);
      sharp(val.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${__dirname}/../public/img/${imageName}`);
    });
  }

  next();
});
const getAllTours = (req, res, next) => {
  hand.getAll(req, res, next, Tours, option);
};

const getOneTour = (req, res, next) => {
  hand.getOne(req, res, next, Tours, option);
};
const addTour = (req, res, next) => {
  console.log(req.files);
  hand.add(req, res, next, Tours);
};

const updateTour = (req, res, next) => {
  console.log(req.files);
  hand.update(req, res, next, Tours, option);
};
const deleteTour = (req, res, next) => {
  hand.deleteData(req, res, next, Tours, option);
};
module.exports = {
  getAllTours,
  getOneTour,
  addTour,
  updateTour,
  deleteTour,
  uploadTourImages,
  resizeImg,
};
