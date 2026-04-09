import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  const addTransaction = (transaction) => {
    const newTransactions = [{ ...transaction, id: Date.now() }, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem('transactions', JSON.stringify(newTransactions));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Expense Tracker</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-600">Balance</h3>
            <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-600">Income</h3>
            <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-gray-600">Expenses</h3>
            <p className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</p>
          </div>
        </div>

        <button 
          onClick={() => setShowForm(true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold mb-8 hover:bg-blue-50"
        >
          + Add Transaction
        </button>

        {showForm && (
          <TransactionForm 
            onClose={() => setShowForm(false)}
            onAdd={addTransaction}
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          {transactions.map(t => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TransactionForm({ onClose, onAdd }) {
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, amount: parseFloat(form.amount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({...form, date: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex-1">
              Add
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }) {
  return (
    <div className="flex items-center justify-between py-3 border-b">
      <div>
        <p className="font-medium">{transaction.description}</p>
        <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
      </div>
      <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
      </p>
    </div>
  );
}

export default App;

