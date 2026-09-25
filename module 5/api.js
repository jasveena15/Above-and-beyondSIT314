const express = require("express");
const mongoose = require("mongoose");
const os = require("os");
const Sensor = require("./models/sensor");

const app = express();
const port = 3000;
const instanceName = os.hostname();

app.use(express.json());

app.use((req, res, next) => {
    res.set("X-Served-By", instanceName);
    next();
});

app.get("/health", (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ status: "unhealthy" });
    }

    res.json({ status: "healthy", instance: instanceName });
});

app.post("/readings", async (req, res) => {
    try {
        const reading = await Sensor.create({
            name: req.body.name,
            address: req.body.address,
            temperature: req.body.temperature,
            time: new Date()
        });

        res.status(201).json(reading);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/readings", async (req, res) => {
    try {
        const readings = await Sensor.find().sort({ time: -1 });
        res.json(readings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/readings/:id", async (req, res) => {
    try {
        const reading = await Sensor.findById(req.params.id);

        if (!reading) {
            return res.status(404).json({ message: "Reading not found" });
        }

        res.json(reading);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put("/readings/:id", async (req, res) => {
    try {
        const reading = await Sensor.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                address: req.body.address,
                temperature: req.body.temperature,
                time: new Date()
            },
            { returnDocument: "after" }
        );

        if (!reading) {
            return res.status(404).json({ message: "Reading not found" });
        }

        res.json(reading);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete("/readings/:id", async (req, res) => {
    try {
        const reading = await Sensor.findByIdAndDelete(req.params.id);

        if (!reading) {
            return res.status(404).json({ message: "Reading not found" });
        }

        res.json({ message: "Reading deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => {
        app.listen(port, () => {
            console.log(`API running on port ${port}`);
            console.log(`Instance: ${instanceName}`);
            console.log("Connected to MongoDB Atlas");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    });