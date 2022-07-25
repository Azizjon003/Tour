const mongoose = reqiure("mongoose");

reviewSchema.index({ user: 1, tour: 1 }, { unique: true }); // bir marta  kamentariya yozish
