const Router = require("express").Router();
const obj = require("../controller/tourconstroller");
const auth = require("../controller/authConstroller");
Router.route("/").get(obj.getAllTours).post(auth.protect, obj.addTour);
Router.route("/:id")
  .get(obj.getOneTour)
  .patch(auth.protect, auth.role(["admin", "lead-guide"]), obj.updateTour)
  .delete(auth.protect, auth.role(["admin", "lead-guide"]), obj.deleteTour);

module.exports = Router;
