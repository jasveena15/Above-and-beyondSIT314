const express = require("express");

const app = express();
app.use(express.json());

const port = 4000;

let currentMode = "OFF";
let currentTemperature = 24;

app.post("/hvac", (req, res) => {
    const { mode, targetTemperature } = req.body;

    currentMode = mode;
    currentTemperature = targetTemperature;

    console.log(
        `HVAC updated -> Mode: ${currentMode}, Target temperature: ${currentTemperature}°C`
    );

    res.json({
        message: "HVAC configuration updated",
        mode: currentMode,
        targetTemperature: currentTemperature
    });
});

app.get("/status", (req, res) => {
    res.json({
        mode: currentMode,
        targetTemperature: currentTemperature
    });
});

app.listen(port, () => {
    console.log(`HVAC node running on port ${port}`);
});