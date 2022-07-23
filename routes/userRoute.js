const Router = require("express").Router();
const obj = require("../controller/userConstroller");
const auth = require("../controller/authConstroller");
console.log(auth);
Router.route("/signup").post(auth.signup);
Router.route("/signin").post(auth.login);
Router.route("/forgotpassword").post(auth.forgotPassword);
Router.route("/resetpassword/:token").patch(auth.resetPassword);
Router.route("/updatepassword").patch(auth.updatePassword);
Router.route("/updateme").patch(auth.protect, auth.updateMe);
Router.route("/deleteme").patch(auth.protect, auth.deleteUser);
Router.route("/").get(obj.getAllUser).post(obj.addUser);
Router.route("/:id")
  .get(obj.getOneUser)
  .patch(obj.updateUser)
  .delete(obj.deleteUser);

module.exports = Router;
