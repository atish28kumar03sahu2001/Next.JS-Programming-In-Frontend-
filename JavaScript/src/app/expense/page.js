'use client'
import { useState, useEffect } from 'react';
export default function page() {
    const [expenses, setExpenses] = useState([]);
    const [form, setForm] = useState({ name: '', expenseId: '', price: '', date: '', });

    const fetchExpenses = async () => {
        const res = await fetch('api/expenses');
        const data = await res.json();
        setExpenses(data.data);
    };
    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        setExpenses([...expenses, data.data]);
      };
    
      const handleDelete = async (id) => {
        await fetch(`api/expenses/${id}`, {
          method: 'DELETE',
        });
        setExpenses(expenses.filter((expense) => expense._id !== id));
      };
    
      const handleUpdate = async (id) => {
        const newExpense = prompt("Enter new expense details (name, expenseId, price, date):");
        const [name, expenseId, price, date] = newExpense.split(',');
        const res = await fetch(`api/expenses/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, expenseId, price, date }),
        });
        const data = await res.json();
        setExpenses(expenses.map(expense => expense._id === id ? data.data : expense));
      };
    return (
        <>
            <h1>Expense Report</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Expense Name" />
                <input type="text" name="expenseId" value={form.expenseId} onChange={handleChange} placeholder="Expense ID" />
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Expense Price" />
                <input type="date" name="date" value={form.date} onChange={handleChange} placeholder="Expense Date" />
                <button type="submit">Submit</button>
            </form>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense._id}>
                        {expense.name} - {expense.expenseId} - {expense.price} - {expense.date}
                        <button onClick={() => handleUpdate(expense._id)}>Update</button>
                        <button onClick={() => handleDelete(expense._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </>
    );
}