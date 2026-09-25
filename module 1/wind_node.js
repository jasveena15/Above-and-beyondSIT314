const net = require("net");

const host = "127.0.0.1";
const port = 6000;

const client = net.createConnection(port, host, () => {
    console.log("Wind node connected");

    setInterval(() => {
        const hour = new Date().getHours();

        let minWind;
        let maxWind;

        if (hour >= 6 && hour < 12) {
            minWind = 5;
            maxWind = 25;
        } else if (hour >= 12 && hour < 18) {
            minWind = 15;
            maxWind = 60;
        } else if (hour >= 18 && hour < 22) {
            minWind = 10;
            maxWind = 40;
        } else {
            minWind = 5;
            maxWind = 20;
        }

        const wind =
            Math.floor(Math.random() * (maxWind - minWind + 1)) + minWind;

        console.log(`Sending wind speed: ${wind} km/h`);
        client.write(`wind,${wind}`);
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