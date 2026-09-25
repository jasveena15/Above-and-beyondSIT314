const mongoose = require("mongoose");

const mongoUri =
    "mongodb://kaurjasveena15_db_user:inderjeetkalra.15@" +
    "ac-nq2t3g0-shard-00-00.dvntpfi.mongodb.net:27017," +
    "ac-nq2t3g0-shard-00-01.dvntpfi.mongodb.net:27017," +
    "ac-nq2t3g0-shard-00-02.dvntpfi.mongodb.net:27017/" +
    "smart_seminar" +
    "?tls=true" +
    "&replicaSet=atlas-2xw89p-shard-0" +
    "&authSource=admin" +
    "&retryWrites=true" +
    "&w=majority";

async function connectDatabase() {
    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
    }
}

module.exports = connectDatabase;