const view = require("../controller/viewContorller");

const Router = require("express").Router();

Router.route("/home").get(view.getAllTour);
Router.route("/").get(view.getAllTour);
Router.route("/tour/:id").get(view.getOneTour);
Router.route("/login").get(view.login);
module.exports = Router;
