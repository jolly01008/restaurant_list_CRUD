const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "process") {
  require("dotenv").config();
}

//設定連線到mongoDB，與資料庫連線
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const Restaurant_list = new Schema({
  name: { type: String, required: true },
  name_en: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  google_map: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Restaurant", Restaurant_list);
