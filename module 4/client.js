const axios = require("axios");

const baseUrl = "http://localhost:3000";

async function runTests() {
    try {
        console.log("\n1. CREATE");

        const createResponse = await axios.post(
            `${baseUrl}/readings`,
            {
                name: "temperatureSensor1",
                address: "Burwood VIC",
                temperature: 24
            }
        );

        console.log(createResponse.data);

        const id = createResponse.data._id;

        console.log("\n2. READ ALL");

        const allResponse = await axios.get(
            `${baseUrl}/readings`
        );

        console.log(allResponse.data);

        console.log("\n3. READ BY ID");

        const oneResponse = await axios.get(
            `${baseUrl}/readings/${id}`
        );

        console.log(oneResponse.data);

        console.log("\n4. UPDATE");

        const updateResponse = await axios.put(
            `${baseUrl}/readings/${id}`,
            {
                name: "temperatureSensor1",
                address: "Burwood VIC",
                temperature: 29
            }
        );

        console.log(updateResponse.data);

        console.log("\n5. LATEST TEMPERATURE");

        const latestResponse = await axios.get(
            `${baseUrl}/latest`
        );

        console.log(latestResponse.data);

        console.log("\n6. WEATHER LOOKUP");

        const weatherResponse = await axios.get(
            `${baseUrl}/weather/Melbourne`
        );

        console.log(weatherResponse.data);

        console.log("\n7. DELETE");

        const deleteResponse = await axios.delete(
            `${baseUrl}/readings/${id}`
        );

        console.log(deleteResponse.data);

    } catch (error) {
        if (error.response) {
            console.log(
                "Error:",
                error.response.status,
                error.response.data
            );
        } else {
            console.log("Error:", error.message);
        }
    }
}

runTests();