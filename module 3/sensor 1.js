const axios = require("axios");

const edgeUrl = "http://localhost:3000/sensor";

setInterval(async () => {
    const data = {
        sensor: "sensor1",
        temperature: Math.floor(Math.random() * 10) + 20,
        humidity: Math.floor(Math.random() * 30) + 40,
        chairsUsed: Math.floor(Math.random() * 21)
    };

    console.log("Sensor 1 data:", data);

    try {
        const response = await axios.post(edgeUrl, data);
        console.log("Edge response:", response.data);
    } catch (error) {
        console.log("Error:", error.message);
    }
}, 5000);
