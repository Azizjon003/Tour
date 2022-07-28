const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const fs = require('fs');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

const { path } = require('../../app');

mongoose
  .connect(process.env.DATABASE, {})
  .then(() => {
    console.log('Db connected');
  })
  .catch((err) => {
    console.log(err);
  });

const tour = JSON.parse(fs.readFileSync(`./dev-data/data/tours.json`, 'utf-8'));
const user = JSON.parse(fs.readFileSync(`./dev-data/data/users.json`, 'utf-8'));
const review = JSON.parse(
  fs.readFileSync(`./dev-data/data/reviews.json`, 'utf-8')
);
// console.log(data);

const addData = async () => {
  try {
    await Tour.create(tour);
    await User.create(user);
    await Review.create(review);
    console.log('Fayllar yozildi');
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Fayllar ochirildi');
  } catch (err) {
    console.log(err);
  }
};

// deleteData();

// addData();

// console.log(data);
