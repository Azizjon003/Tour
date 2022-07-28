const Router = require("express").Router({ mergeParams: true });
const obj = require("../controller/tourconstroller");
const auth = require("../controller/authConstroller");
const review = require("./review");

Router.use("/:tourid/review", review);
Router.route("/").get(obj.getAllTours).post(auth.protect, obj.addTour);
Router.route("/:id")
  .get(obj.getOneTour)
  .patch(auth.protect, auth.role(["admin", "lead-guide"]), obj.updateTour)
  .delete(auth.protect, auth.role(["admin", "lead-guide"]), obj.deleteTour);

module.exports = Router;
