const hand = require("./handlerController");
const Tours = require("../model/tourModel");

const getAllTours = (req, res, next) => {
  hand.getAll(req, res, next, Tours);
};

const getOneTour = (req, res, next) => {
  hand.getOne(req, res, next, Tours);
};
const addTour = (req, res, next) => {
  hand.add(req, res, next, Tours);
};

const updateTour = (req, res, next) => {
  hand.update(req, res, next, Tours);
};
const deleteTour = (req, res, next) => {
  hand.deleteData(req, res, next, Tours);
};
module.exports = {
  getAllTours,
  getOneTour,
  addTour,
  updateTour,
  deleteTour,
};
