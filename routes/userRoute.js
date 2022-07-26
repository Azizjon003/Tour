const Router = require("express").Router();
const obj = require("../controller/userConstroller");
const auth = require("../controller/authConstroller");

console.log(auth);
Router.route("/signup").post(auth.signup);

Router.route("/signin").post(auth.login);

Router.route("/forgotpassword").post(auth.forgotPassword);

Router.route("/updatepassword").patch(auth.protect, auth.updatePassword);

Router.route("/resetpassword/:token").patch(auth.resetPassword);

Router.route("/updateme").patch(
  auth.protect,
  auth.uploadImg,
  auth.resizeImg,
  auth.updateMe
);

Router.route("/deleteme").patch(auth.protect, auth.deleteUser);

Router.route("/")
  .get(auth.protect, obj.getAllUser)
  .post(auth.protect, obj.addUser);

Router.route("/:id")
  .get(auth.protect, obj.getOneUser)
  .patch(auth.protect, auth.role(["admin", "lead-guide"]), obj.updateUser)
  .delete(auth.protect, obj.deleteUser);

module.exports = Router;
