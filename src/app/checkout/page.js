'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

const CheckOutPage = () => {
  const [checkOuts, setCheckOuts] = useState([]);
  const [newCheckOut, setNewCheckOut] = useState({ item: '', quantity: '' });

  useEffect(() => {
    // Fetch all checkouts on component mount
    axios.get('/api/checkouts')
      .then(response => setCheckOuts(response.data))
      .catch(error => console.error('Error fetching checkouts:', error));
  }, []);

  const addCheckOut = () => {
    axios.post('/api/checkouts', newCheckOut)
      .then(response => {
        setCheckOuts([...checkOuts, response.data]);
        setNewCheckOut({ item: '', quantity: '' });  // Clear the input fields
      })
      .catch(error => console.error('Error adding checkout:', error));
  };

  const deleteCheckOut = (id) => {
    axios.delete(`/api/checkouts/${id}`)
      .then(() => {
        setCheckOuts(checkOuts.filter(checkOut => checkOut.id !== id));
      })
      .catch(error => console.error('Error deleting checkout:', error));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-semibold text-center mb-6">CheckOut</h1>

      {/* Add New Checkout Form */}
      <div className="text-black bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-medium mb-4">Add New Checkout</h2>
        <div className="flex space-x-4 mb-4">
          <input 
            type="text" 
            placeholder="Item" 
            className="border border-gray-300 p-2 rounded-md w-full"
            value={newCheckOut.item} 
            onChange={(e) => setNewCheckOut({ ...newCheckOut, item: e.target.value })}
          />
          <input 
            type="number" 
            placeholder="Quantity" 
            className="border border-gray-300 p-2 rounded-md w-full"
            value={newCheckOut.quantity} 
            onChange={(e) => setNewCheckOut({ ...newCheckOut, quantity: e.target.value })}
          />
        </div>
        <button 
          onClick={addCheckOut} 
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
        >
          Add Checkout
        </button>
      </div>

      {/* Display All Checkouts */}
      <div className="text-black bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-medium mb-4">All Checkouts</h2>
        <ul className="space-y-4">
          {checkOuts.map(checkOut => (
            <li key={checkOut.id} className="flex justify-between items-center">
              <span className="text-lg">{checkOut.item} (Quantity: {checkOut.quantity})</span>
              <button 
                onClick={() => deleteCheckOut(checkOut.id)} 
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CheckOutPage;
