const obj = require("../controller/langController");
const auth = require("../controller/authConstroller");
const Router = require("express").Router();
Router.route("/").get(obj.getAllLang).post(obj.addLang);
Router.route("/:id")
  .get(obj.getOneLang)
  .patch(obj.updateLang)
  .delete(auth.protect, obj.deleteLang);

module.exports = Router;
