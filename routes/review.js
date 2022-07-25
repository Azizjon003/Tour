const auth = require("../controller/authConstroller");
const router = require("express").Router();
// const
router
  .route("/")
  .get(getAll)
  .post(auth.protect, auth.role(["user"]));

router.route("/:id").get(getOne).patch(update).delete(deleteData);

module.exports = router;
