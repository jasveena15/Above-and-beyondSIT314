const net = require("net");

const host = "127.0.0.1";
const port = 6000;

const client = net.createConnection(port, host, () => {
    console.log("Temperature node connected");

    setInterval(() => {
        const hour = new Date().getHours();

        let minTemp;
        let maxTemp;

        if (hour >= 6 && hour < 12) {
            minTemp = 12;
            maxTemp = 20;
        } else if (hour >= 12 && hour < 18) {
            minTemp = 20;
            maxTemp = 32;
        } else if (hour >= 18 && hour < 22) {
            minTemp = 15;
            maxTemp = 24;
        } else {
            minTemp = 8;
            maxTemp = 16;
        }

        const temp =
            Math.floor(Math.random() * (maxTemp - minTemp + 1)) + minTemp;

        console.log(`Sending temperature: ${temp}°C`);
        client.write(`temp,${temp}`);
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