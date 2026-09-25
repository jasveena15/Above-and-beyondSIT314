const express = require("express");
const mongoose = require("mongoose");
const weather = require("weather-js");
const Sensor = require("./models/sensor");

const app = express();
const port = 3000;

app.use(express.json());

const mongoUri =
    "mongodb://kaurjasveena15_db_user:inderjeetkalra.15@" +
    "ac-nq2t3g0-shard-00-00.dvntpfi.mongodb.net:27017," +
    "ac-nq2t3g0-shard-00-01.dvntpfi.mongodb.net:27017," +
    "ac-nq2t3g0-shard-00-02.dvntpfi.mongodb.net:27017/" +
    "weather_service" +
    "?tls=true" +
    "&replicaSet=atlas-2xw89p-shard-0" +
    "&authSource=admin" +
    "&retryWrites=true" +
    "&w=majority";

mongoose.connect(mongoUri)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error.message);
    });

// CREATE
app.post("/readings", async (req, res) => {
    try {
        const sensor = new Sensor({
            name: req.body.name,
            address: req.body.address,
            time: new Date(),
            temperature: req.body.temperature
        });

        const savedSensor = await sensor.save();

        res.json(savedSensor);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ ALL
app.get("/readings", async (req, res) => {
    try {
        const readings = await Sensor.find();

        res.json(readings);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// READ BY ID
app.get("/readings/:id", async (req, res) => {
    try {
        const reading = await Sensor.findById(req.params.id);

        if (!reading) {
            return res.status(404).json({
                message: "Reading not found"
            });
        }

        res.json(reading);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE
app.put("/readings/:id", async (req, res) => {
    try {
        const updatedReading = await Sensor.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                address: req.body.address,
                temperature: req.body.temperature,
                time: new Date()
            },
            {
                returnDocument: "after"
            }
        );

        if (!updatedReading) {
            return res.status(404).json({
                message: "Reading not found"
            });
        }

        res.json(updatedReading);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// DELETE
app.delete("/readings/:id", async (req, res) => {
    try {
        const deletedReading = await Sensor.findByIdAndDelete(
            req.params.id
        );

        if (!deletedReading) {
            return res.status(404).json({
                message: "Reading not found"
            });
        }

        res.json({
            message: "Reading deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET LATEST TEMPERATURE
app.get("/latest", async (req, res) => {
    try {
        const latestReading = await Sensor.findOne()
            .sort({ time: -1 });

        if (!latestReading) {
            return res.status(404).json({
                message: "No temperature readings found"
            });
        }

        res.json({
            sensor: latestReading.name,
            temperature: latestReading.temperature,
            time: latestReading.time
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET WEATHER BY LOCATION
app.get("/weather/:location", (req, res) => {
    const location = req.params.location;

    weather.find(
        {
            search: location,
            degreeType: "C"
        },
        function (error, result) {
            if (error) {
                console.log(error);

                return res.status(500).json({
                    message: "Weather service error"
                });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({
                    message: "Location not found"
                });
            }

            res.json({
                location: result[0].location.name,
                temperature: result[0].current.temperature,
                feelsLike: result[0].current.feelslike,
                humidity: result[0].current.humidity,
                condition: result[0].current.skytext
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Weather API running on port ${port}`);
});
