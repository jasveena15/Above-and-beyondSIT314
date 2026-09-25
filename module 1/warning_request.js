const net = require("net");

const host = "127.0.0.1";
const port = 6000;

const client = net.createConnection(port, host, () => {
    console.log("Warning request node connected");

    setInterval(() => {
        console.log("Requesting current weather warning");
        client.write("request,0");
    }, 3000);
});

client.on("data", (data) => {
    console.log(`Weather service response: ${data}`);
});

client.on("error", (error) => {
    console.log(`Error: ${error.message}`);
});

client.on("close", () => {
    console.log("Connection closed");
});