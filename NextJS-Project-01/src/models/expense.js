// src/models/expense.js
import mongoose from 'mongoose';
const ExpenseSchema = new mongoose.Schema({
    expid: { type: String, required: true },
    expname: { type: String, required: true },
    expprice: { type: Number, required: true },
    expdate: { type: Date, required: true },
    expimg: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});
const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

export { Expense };