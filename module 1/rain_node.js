const net = require("net");

const host = "127.0.0.1";
const port = 6000;

const client = net.createConnection(port, host, () => {
    console.log("Rain node connected");

    setInterval(() => {
        const month = new Date().getMonth() + 1;

        let minRain;
        let maxRain;

        if (month >= 6 && month <= 8) {
            minRain = 20;
            maxRain = 140;
        } else if (month >= 3 && month <= 5) {
            minRain = 5;
            maxRain = 90;
        } else if (month >= 9 && month <= 11) {
            minRain = 5;
            maxRain = 80;
        } else {
            minRain = 0;
            maxRain = 50;
        }

        const rain =
            Math.floor(Math.random() * (maxRain - minRain + 1)) + minRain;

        console.log(`Sending rainfall: ${rain} mm`);
        client.write(`rain,${rain}`);
    }, 2000);
});

client.on("data", (data) => {
    console.log(`Server response: ${data}`);
});

client.on("error", (error) => {
    console.log(`Error: ${error.message}`);
});

client.on("close", () => {
    console.log("Connection closed");
});