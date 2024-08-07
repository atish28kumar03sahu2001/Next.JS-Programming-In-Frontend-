import mongoose from "mongoose";
const connection = {};

export const connectToDB = async () => {
    try {
        if (connection.isConnected) {
            console.log("Using Existing Connection");
            return;
        }
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Error:", error);
        throw new Error(error);
    }
}
