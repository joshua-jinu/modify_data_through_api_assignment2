const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB server connected: ${conn.connection.host}`);
    }catch(err){
        console.log(`Error in connection: ${err}`);
    }
} 

module.exports = connectDB;