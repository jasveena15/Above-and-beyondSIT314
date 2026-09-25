const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    sensor: String,
    temperature: Number,
    humidity: Number,
    chairsUsed: Number,
    mode: String,
    targetTemperature: Number,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Log", logSchema);