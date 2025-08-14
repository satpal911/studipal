const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        await mongoose.connect("mongodb+srv://pal0005911:Ha1W74wgAKlxoELD@cluster0.3jjhvkd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("database connected successfully")
    } catch (error) {
        console.log("database connecting error")
    }
}

module.exports = connectDb