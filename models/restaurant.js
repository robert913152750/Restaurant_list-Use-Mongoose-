const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String,
    reguired: false
  },
  category: {
    type: String,
    reguired: true
  },
  image: {
    type: String,
    reguired: false
  },
  location: {
    type: String,
    reguired: true
  },
  phone: {
    type: String,
    reguired: true
  },
  google_map: {
    type: String,
    reguired: true
  },
  rating: {
    type: Number,
    reguired: true
  },
  description: {
    type: String,
    reguired: true
  }
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
