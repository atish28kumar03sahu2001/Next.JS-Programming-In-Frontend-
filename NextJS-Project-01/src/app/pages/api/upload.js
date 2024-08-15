import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
// import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { Expense } from '../../src/models/expense'; // Import the Mongoose model

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: 'public/uploads', // Ensure this directory exists
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
    }),
});

const handler = nextConnect()
    .use(upload.single('expimg')) // Handle single file upload
    .post(async (req, res) => {
        const { expid, expname, expprice, expdate, user } = req.body;
        const expimg = req.file ? `/uploads/${req.file.filename}` : '';

        try {
            // Connect to MongoDB using Mongoose
            if (!mongoose.connection.readyState) {
                await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            }

            // Save data to MongoDB
            const newExpense = new Expense({
                expid,
                expname,
                expprice: parseFloat(expprice),
                expdate: new Date(expdate),
                expimg,
                user
            });

            await newExpense.save();

            res.status(201).json({ success: true, data: newExpense });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    });

export default handler;