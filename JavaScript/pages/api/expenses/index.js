import connectToDatabase from "../../../lib/mongodb";
import Expense from "../../../models/Expense";

export default async function handler(req, res) {
    const { method } = req;
  
    await connectToDatabase();
  
    switch (method) {
      case 'GET':
        try {
          const expenses = await Expense.find({});
          res.status(200).json({ success: true, data: expenses });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;

      case 'POST':
        try {
          const expense = await Expense.create(req.body);
          res.status(201).json({ success: true, data: expense });
        } catch (error) {
          res.status(400).json({ success: false });
        }
        break;
        
      default:
        res.status(400).json({ success: false });
        break;
    }
}