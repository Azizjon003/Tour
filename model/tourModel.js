const mongoose = require("mongoose");
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name reuiqred"],
      minlength: [10, "10 elemnt kiriting"],
      maxlength: [40, "40 tadan elemnt kiriting"],
    },
    duration: {
      type: Number,
      required: true,
      min: [1, "past qiymat kiritdingiz"],
      max: [100, "BUndan ko'p qiymat kiritmang "],
    },
    maxGroupSize: {
      type: Number,
      default: 5,
      validate: {
        validator: function (val) {
          if (val > 0 && Number.isInteger(val)) return true;
          else return false;
        },
        message: "Natural son kiriting",
      },
    },

    difficulty: {
      type: String,
      required: true,
      default: "easy",
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Siz xato ma'lumot kiritdingiz",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 5,
    },
    ratingsQuantity: Number,
    price: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    imageCover: {
      type: String,
      default: "images/userdefault.jpg",
    },
    images: {
      type: Array,
      body: String,
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      cordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        cordinates: [Number],
        day: Number,
        description: String,
      },
    ],
    guides: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Users",
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Schema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "tour",
  localField: "_id",
});
Schema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -_id",
  })
  next();
});

// Schema.index("price"); // price bo'yicha tartiblangan holatda saqlanadi

const Tours = mongoose.model("Tours", Schema);
module.exports = Tours;
