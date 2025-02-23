'use client';

import React, { useState } from 'react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRouter } from "next/navigation";

const FinanceDashboard = () => {
  const router = useRouter();
  const [monthlySpending, setMonthlySpending] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [error, setError] = useState('');

  const processCSV = (csv) => {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase()); // Convert to lowercase
  
    // Define expected columns in lowercase
    const requiredColumns = ['date', 'description', 'amount (inr)', 'payment method'];
  
    // Check if all required columns exist
    if (!requiredColumns.every(col => headers.includes(col))) {
      setError('CSV must have columns: Date, Description, Amount (INR), Payment Method');
      return;
    }
  
    const dateIndex = headers.indexOf('date');
    const amountIndex = headers.indexOf('amount (inr)');
    const paymentMethodIndex = headers.indexOf('payment method');
  
    const monthlyData = {};
    const paymentMethodTotals = {};
    let validTransactions = 0;
  
    lines.slice(1).forEach(line => {
      if (line.trim()) {
        const values = line.split(',').map(value => value.trim());
        try {
          const date = new Date(values[dateIndex]);
          const month = date.toLocaleString('default', { month: 'short' });
          const amount = Math.abs(parseFloat(values[amountIndex].replace(/[^0-9.-]+/g, '')));
          const paymentMethod = values[paymentMethodIndex];
  
          if (!isNaN(date.getTime()) && !isNaN(amount)) {
            // Monthly spending
            monthlyData[month] = (monthlyData[month] || 0) + amount;
            
            // Payment method totals
            paymentMethodTotals[paymentMethod] = (paymentMethodTotals[paymentMethod] || 0) + amount;
  
            validTransactions++;
          }
        } catch (e) {
          console.error('Error processing line:', e);
        }
      }
    });
  
    setMonthlySpending(Object.entries(monthlyData).map(([month, amount]) => ({ month, amount })));
    setPaymentMethodData(Object.entries(paymentMethodTotals).map(([name, value]) => ({ name, value })));
    setTransactionCount(validTransactions);
    setError('');
  };
  

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        setError('Please upload a CSV file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        processCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const totalSpent = paymentMethodData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
        <div className="flex justify-center">
            <h1 className="text-4xl font-extrabold mb-6 text-black text-center">
            Financial Dashboard
            </h1>
        </div>
      
      {/* File Upload Section */}
      <div className="mb-8">
  <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
    <h2 className="text-black text-lg font-semibold mb-5">
      Upload Transaction Data
    </h2>
    <label className="block w-full cursor-pointer">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-violet-500 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 transition-all">
        <span className="text-sm font-medium">Click to upload a CSV file</span>
        <span className="text-xs text-gray-500 mt-1">
          Supported format: .csv
        </span>
      </div>
    </label>
    {error && <p className="text-red-500 mt-3">{error}</p>}
    <p className="text-sm text-gray-500 mt-3">
      CSV must include columns: <span className="font-medium">date</span>,{" "}
      <span className="font-medium">description</span>,{" "}
      <span className="font-medium">amount</span>,{" "}
      <span className="font-medium">Payment Method</span>.
    </p>
  </div>
</div>

        <div className="flex justify-center mt-6 mb-10 ml-10 px-20">
        <button
            onClick={() => router.push("/chatbot")}
            className="bg-blue-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
        >
            Ask Your Doubt with MetroBoomin
        </button>
        </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-black text-sm font-medium">Total Spending</h2>
          <p className="text-3xl font-bold text-black">Rs {totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-black text-sm font-medium">Average Transaction</h2>
          <p className="text-3xl font-bold text-black">
            Rs {transactionCount ? (totalSpent / transactionCount).toFixed(2) : '0.00'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-black text-sm font-medium">Total Transactions</h2>
          <p className="text-3xl font-bold text-black">{transactionCount}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Monthly Spending Trend</h2>
          <div className="h-80">
            {monthlySpending.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fill: 'black' }} />
                  <YAxis tick={{ fill: 'black' }} />
                  <Tooltip contentStyle={{ color: 'black' }} />
                  <Legend wrapperStyle={{ color: 'black' }} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#4F46E5" 
                    name="Spending"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Upload CSV to view spending trend
              </div>
            )}
            
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">Spending by Payment Method</h2>
          <div className="h-80">
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#4F46E5"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  />
                  <Tooltip contentStyle={{ color: 'black' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Upload CSV to view payment method distribution
              </div>
            )}
          </div>
        </div>
        
      </div>
      <br/>
      <br/>

    </div>
  );
};

export default FinanceDashboard;