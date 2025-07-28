const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  }
});

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  chassisNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  history: [historySchema],
});

const History = mongoose.model('History', historySchema);
const Car = mongoose.model('Car', carSchema);

module.exports = { History, Car };