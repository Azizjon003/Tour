const mongoose = require("mongoose");

const review = new mongoose.Schema(
  {
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    cratedAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tours",
      required: true,
    },
  },
  {
    toJSON: { virtual: true },
    toObject: { virtual: true },
  }
);

review.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});
const reviews = mongoose.model("Reviews", review);
module.exports = reviews;
