const Lang = require("../model/lang");
const hand = require("./handlerController");

const getAllLang = (req, res, next) => {
  hand.getAll(req, res, next, Lang);
};
const getOneLang = (req, res, next) => {
  hand.getOne(req, res, next, Lang);
};

const addLang = (req, res, next) => {
  hand.add(req, res, next, Lang);
};

const updateLang = (req, res, next) => {
  hand.update(req, res, next, Lang);
};
const deleteLang = (req, res, next) => {
  hand.deleteData(req, res, next, Lang);
};

module.exports = {
  getAllLang,
  getOneLang,
  addLang,
  updateLang,
  deleteLang,
};
