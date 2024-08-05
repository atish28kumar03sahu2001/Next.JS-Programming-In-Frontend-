const mongoose = require('mongoose');
const ExpenseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    expenseId: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);