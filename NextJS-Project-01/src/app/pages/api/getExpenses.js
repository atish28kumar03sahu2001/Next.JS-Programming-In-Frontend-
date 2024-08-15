import mongoose from 'mongoose';
import { Expense } from '../../src/models/expense'; // Import the Mongoose model

// MongoDB connection URI
const uri = "mongodb+srv://kumarsahuatish:TyzfjJK2Ky40AmPj@auth.oziov.mongodb.net/"
export default async function handler(req, res) {
    try {
        // Connect to MongoDB using Mongoose
        if (!mongoose.connection.readyState) {
            await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        }

        const userId = req.query.userId;
        const expenses = await Expense.find({ user: userId });

        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
