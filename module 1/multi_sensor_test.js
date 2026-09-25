const net = require("net");

const host = "127.0.0.1";
const port = 6000;

const numberOfSensors = 50;

for (let i = 1; i <= numberOfSensors; i++) {
    const client = net.createConnection(port, host, () => {
        console.log(`Sensor ${i} connected`);

        setInterval(() => {
            const temp = Math.floor(Math.random() * 15) + 18;

            console.log(`Sensor ${i} sending temperature: ${temp}°C`);
            client.write(`temp,${temp}`);
        }, 2000);
    });

    client.on("data", (data) => {
        console.log(`Sensor ${i} response: ${data}`);
    });

    client.on("error", (error) => {
        console.log(`Sensor ${i} error: ${error.message}`);
    });
}