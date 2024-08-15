// src/database/index.js
import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
    if (isConnected) {
        console.log('Already connected to the database');
        return;
    }

    try {
        const dbURI = process.env.MONGODB_URI || "mongodb+srv://kumarsahuatish:TyzfjJK2Ky40AmPj@auth.oziov.mongodb.net/";
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('Connected to the database');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw new Error('Failed to connect to the database');
    }
};
