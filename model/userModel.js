const mongoose = require("mongoose");
const AppError = require("../utility/apperror");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [5, "name must be at least 5 characters"],
      maxlength: [40, "name must be at most 40 characters"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      minlength: [10, "email must be at least 10 characters"],
      lowercase: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "email is invalid",
      },
    },
    photo: {
      type: String,
      default: "img/users/default.jpg",
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
      },
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (value) {
          return this.password === value;
        },
        message: "password and password confirm must be the same",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "lead-guide", "guide"],
      default: "user",
    },
    passwordChangedAt: Date,
    hashToken: String,
    expiresDate: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
UserSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "user",
  localField: "_id",
});
UserSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashPass = await bcrypt.hash(this.password, 12);
  this.password = hashPass;
  this.passwordConfirm = undefined;
});
UserSchema.methods.resetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log(`random token : ${resetToken}`);
  const hashToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.hashToken = hashToken;
  console.log(`hash token : ${hashToken}`);
  this.expiresDate = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
UserSchema.pre("save", function (next) {
  if (!this.isModified(this.password) || this.IsNew) return next();
  this.passwordChangeDate = Date.now() - 1000;
  next();
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
