const Router = require("express").Router();
const obj = require("../controller/userConstroller");
const auth = require("../controller/authConstroller");
console.log(auth);
Router.route("/signup").post(auth.signup);
Router.route("/signin").post(auth.login);
Router.route("/forgotpassword").post(auth.forgotPassword);
Router.route("/").get(obj.getAllUser).post(obj.addUser);
Router.route("/:id")
  .get(obj.getOneUser)
  .patch(obj.updateUser)
  .delete(obj.deleteUser);

module.exports = Router;
