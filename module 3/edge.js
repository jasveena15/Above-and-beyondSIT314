const connectDatabase = require("./db");
const express = require("express");
const axios = require("axios");
const Log = require("./logModel");

const app = express();
app.use(express.json());

const port = 3000;
const hvacUrl = "http://localhost:4000/hvac";

connectDatabase();

app.post("/sensor", async (req, res) => {
    const data = req.body;

    console.log("Sensor data received:", data);

    let mode = "OFF";
    let targetTemperature = 24;

    if (data.chairsUsed === 0) {
        mode = "OFF";
        targetTemperature = 24;
    } else if (data.temperature > 27 || data.humidity > 65) {
        mode = "COOLING";
        targetTemperature = 21;
    } else if (data.chairsUsed > 10) {
        mode = "VENTILATION";
        targetTemperature = 23;
    } else {
        mode = "NORMAL";
        targetTemperature = 24;
    }

    console.log(
        `Decision -> Mode: ${mode}, Target: ${targetTemperature}°C`
    );

    try {
        const hvacResponse = await axios.post(hvacUrl, {
            mode: mode,
            targetTemperature: targetTemperature
        });

        console.log("HVAC response:", hvacResponse.data);

        const logEntry = new Log({
            sensor: data.sensor,
            temperature: data.temperature,
            humidity: data.humidity,
            chairsUsed: data.chairsUsed,
            mode: mode,
            targetTemperature: targetTemperature
        });

        await logEntry.save();

        console.log("Request logged to MongoDB");

        res.json({
            message: "Sensor data processed",
            mode: mode,
            targetTemperature: targetTemperature
        });
    } catch (error) {
        console.log("Processing error:", error.message);

        res.status(500).json({
            message: "Could not process sensor data"
        });
    }
});

app.listen(port, () => {
    console.log(`Edge node running on port ${port}`);
});