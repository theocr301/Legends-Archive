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
  }
})
const eventSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Event', eventSchema);
module.exports = mongoose.model('Car', carSchema);