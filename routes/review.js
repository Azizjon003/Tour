const auth = require("../controller/authConstroller");
const router = require("express").Router({ mergeParams: true });
const { addReview, getAllReview } = require("../controller/review");
router.route("/").get(getAllReview).post(auth.protect, addReview);

// router.route("/:id").get(getOne).patch(update).delete(deleteData);

module.exports = router;
