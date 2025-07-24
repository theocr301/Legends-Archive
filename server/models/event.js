const mongoose = require('mongoose');

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
  history: [historySchema],
})
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
})

module.exports = mongoose.model('History', historySchema);
module.exports = mongoose.model('Car', carSchema);