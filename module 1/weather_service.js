const net = require("net");

const port = 6000;

const temperatures = [];
const rainReadings = [];
const windReadings = [];

const MAX_READINGS = 50;

function addReading(list, value) {
    list.push(value);

    if (list.length > MAX_READINGS) {
        list.shift();
    }
}

function average(list) {
    if (list.length === 0) {
        return 0;
    }

    const total = list.reduce((sum, value) => sum + value, 0);
    return total / list.length;
}

const server = net.createServer((socket) => {
    console.log("Client connected");

    socket.on("data", (data) => {
        const strData = data.toString().trim();
        console.log(`Received: ${strData}`);

        const command = strData.split(",");
        const name = command[0];
        const value = parseFloat(command[1]);

        let result = "Invalid request";

        if (name === "temp") {
            addReading(temperatures, value);
            result = "Temperature received";
        } else if (name === "rain") {
            addReading(rainReadings, value);
            result = "Rainfall received";
        } else if (name === "wind") {
            addReading(windReadings, value);
            result = "Wind speed received";
        } else if (name === "request") {
            const avgTemp = average(temperatures);
            const avgRain = average(rainReadings);
            const avgWind = average(windReadings);

            console.log(
                `Average weather: Temp=${avgTemp.toFixed(1)}°C, Rain=${avgRain.toFixed(1)}mm, Wind=${avgWind.toFixed(1)}km/h`
            );

            if (avgRain > 120) {
                result = "Heavy Rain Warning";
            } else if (avgWind > 70) {
                result = "Strong Wind Warning";
            } else if (avgTemp > 35) {
                result = "High Temperature Warning";
            } else if (avgTemp > 30 && avgWind > 50) {
                result = "Hot and Windy Warning";
            } else {
                result = "Everything fine";
            }
        }

        socket.write(result);
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (error) => {
        console.log(`Socket error: ${error.message}`);
    });
});

server.on("error", (error) => {
    console.log(`Server error: ${error.message}`);
});

server.listen(port, () => {
    console.log(`Weather service running on port ${port}`);
});
