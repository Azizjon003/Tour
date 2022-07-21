const Router = require("express").Router();
const obj = require("../controller/tourconstroller");
const auth = require("../controller/authConstroller");
Router.route("/").get(auth.protect, obj.getAllTours).post(obj.addTour);
Router.route("/:id")
  .get(obj.getOneTour)
  .patch(obj.updateTour)
  .delete(obj.deleteTour);

module.exports = Router;
