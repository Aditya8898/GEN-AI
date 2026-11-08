const mongoose = require("mongoose")

async function connectToDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from environment variables!");
        }

        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database successfully")
    }
    catch (err) {
        console.error("Database connection error:", err.message)
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected")
})

module.exports = connectToDB