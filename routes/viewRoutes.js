const view = require("../controller/viewContorller");
const auth = require("../controller/authConstroller");
const Router = require("express").Router();
Router.route("/home").get(auth.isSignin, view.getAllTour);
Router.route("/login").get(auth.isSignin, view.login);
Router.route("/logout").post(auth.logout);
Router.route("/account").get(auth.isSignin, view.accaunt);
Router.route("/").get(auth.isSignin, view.getAllTour);
Router.route("/tour/:id").get(auth.isSignin, view.getOneTour);

module.exports = Router;
