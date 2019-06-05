const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  flying_time: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    lat: Number,
    lon: Number,
  },
  users: [{
    userId: String,
    groupId: String,
  }],
  timestamp: {
    type: Number,
  },
  waypoints: [{
    lat: Number,
    lon: Number,
  }],

});

module.exports = mongoose.model('Drone', groupSchema);
