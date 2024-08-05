import connectToDatabase from "../../../lib/mongodb";
import Expense from "../../../models/Expense";
export default async function handler(req, res) {
    const {
        query: { id },
        method,
    } = req;

    await connectToDatabase();

    switch (method) {
        case 'GET':
            try {
              const expense = await Expense.findById(id);
              if (!expense) {
                return res.status(404).json({ success: false });
              }
              res.status(200).json({ success: true, data: expense });
            } catch (error) {
              res.status(400).json({ success: false });
            }
            break;

          case 'PUT':
            try {
              const expense = await Expense.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
              });
              if (!expense) {
                return res.status(404).json({ success: false });
              }
              res.status(200).json({ success: true, data: expense });
            } catch (error) {
              res.status(400).json({ success: false });
            }
            break;

          case 'DELETE':
            try {
              const deletedExpense = await Expense.deleteOne({ _id: id });
              if (!deletedExpense) {
                return res.status(404).json({ success: false });
              }
              res.status(200).json({ success: true, data: {} });
            } catch (error) {
              res.status(400).json({ success: false });
            }
            break;
            
          default:
            res.status(400).json({ success: false });
            break;
    }
}