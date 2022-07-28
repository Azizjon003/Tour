const hand = require("./handlerController");
const Tours = require("../model/tourModel");
const option = {
  path: "guides",
  select: "-__v -passwordChangedAt -_id",
};
const getAllTours = (req, res, next) => {
  hand.getAll(req, res, next, Tours, option);
};

const getOneTour = (req, res, next) => {
  hand.getOne(req, res, next, Tours, option);
};
const addTour = (req, res, next) => {
  hand.add(req, res, next, Tours);
};

const updateTour = (req, res, next) => {
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
};
