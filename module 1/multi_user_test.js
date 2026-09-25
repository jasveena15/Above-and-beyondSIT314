const net = require("net");

const host = "127.0.0.1";
const port = 6000;

const numberOfUsers = 10;

for (let i = 1; i <= numberOfUsers; i++) {
    const client = net.createConnection(port, host, () => {
        console.log(`User ${i} connected`);

        setInterval(() => {
            console.log(`User ${i} requesting weather warning`);
            client.write("request,0");
        }, 3000);
    });

    client.on("data", (data) => {
        console.log(`User ${i} response: ${data}`);
    });

    client.on("error", (error) => {
        console.log(`User ${i} error: ${error.message}`);
    });
}