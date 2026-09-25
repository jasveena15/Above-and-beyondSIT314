const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://localhost");
const sensorId = "sensor3";

client.on("connect", () => {
    console.log(`${sensorId} connected to MQTT broker`);

    setInterval(() => {
        const temperature = Math.floor(Math.random() * 25) + 20;
        const smoke = Math.floor(Math.random() * 100);
        const fire = temperature > 40 && smoke > 70;

        const data = {
            sensor: sensorId,
            temperature: temperature,
            smoke: smoke,
            fire: fire
        };

        console.log(data);

        client.publish(
            "forest/sensors",
            JSON.stringify(data)
        );
    }, 3000);
});