const hand = require("./handlerController");
const User = require("../model/userModel");

const getAllUser = (req, res, next) => {
  hand.getAll(req, res, next, User);
};
const getOneUser = (req, res, next) => {
  hand.getOne(req, res, next, User);
};

const addUser = (req, res, next) => {
  hand.add(req, res, next, User);
};

const updateUser = (req, res, next) => {
  hand.update(req, res, next, User);
};
const deleteUser = (req, res, next) => {
  hand.deleteData(req, res, next, User);
};

module.exports = {
  getAllUser,
  getOneUser,
  addUser,
  updateUser,
  deleteUser,
};
