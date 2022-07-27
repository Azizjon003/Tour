const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
process.on("uncaughtException", (err) => {
  console.log(`Name ${err.name}   Message : ${err.message}`);
  process.exit(1);
});
const mongoose = require("mongoose");
const app = require("./meadweare/app");

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB connected");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Listening port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Name ${err.name}   Message : ${err.message}`);
  process.exit(1);
});
