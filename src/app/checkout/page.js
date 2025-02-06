'use client'

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../navbar';

const CheckOutPage = () => {
  const [checkOuts, setCheckOuts] = useState([]);
  const [checkOutData, setCheckOutData] = useState({ book_book_id : '', person_personid: '', check_out_date: '' });
  const [checkOutID, setCheckOutID] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const formatData = () => 
    {
      return {"book_book_id": checkOutData.book_book_id, "person_personid": checkOutData.person_personid, "check_out_date": checkOutData.check_out_date};
    }

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Book ID', accessor: 'book_book_id ' },
    { Header: 'Person ID', accessor: 'person_personid' },
    { Header: 'Check Out Date', accessor: 'check_out_date' },
  ], []);

  useEffect(() => {
    fetchCheckOuts();
  }, []);

  const fetchCheckOuts = () => {
    axios.get('http://localhost:8086/api/checkouts')
      .then(response => {console.log(response.data); setCheckOuts(response.data);})
      .catch(error => console.error('Error fetching checkouts:', error));
  };

  const addCheckOut = () => {
    console.log(checkOutData);
    axios.post('http://localhost:8086/api/checkouts', checkOutData)
      .then((response) => {
        setCheckOuts([...checkOuts, response.data]);
        setShowAddForm(false);
        setCheckOutData({ book_book_id : '', person_personid: '', check_out_date: '' });
        fetchCheckOuts();
      })
      .catch(error => console.error('Error adding checkout:', error));
  };

  const deleteCheckOut = () => {
    axios.delete(`http://localhost:8086/api/checkouts/${checkOutID}`)
      .then(() => {
        setShowDeletePopup(false);
        fetchCheckOuts();
      })
      .catch(error => console.error('Error deleting checkout:', error));
  };
  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const displayData = (checkOut, accessor)=>
    {
      // console.log("CHECKOUT:", checkOut);
      // console.log("Accessor:", accessor);
      // console.log("Item checkOut[accessor]: ", checkOut[accessor]);

      if(accessor === 'book_book_id'){ return checkOut[accessor].book_id; }
      else if(accessor === 'person_personid'){ return checkOut[accessor].personID; }
      else if(accessor === 'check_out_date'){ return formatDate(checkOut[accessor]); }
      return checkOut[accessor]; // id or null
    }

  return (
    <div className="max-w-3xl mx-auto p-6 text-black">
      <Navbar/>
      <h1 className="text-4xl font-semibold text-center mb-6">CheckOut</h1>

      <button 
        onClick={() => setShowAddForm(true)} 
        className="bg-blue-500 text-white p-2 rounded-md mb-4"
      >
        Add Checkout
      </button>

      {/* Display All Checkouts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-medium mb-4">All CheckOuts</h2>
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.accessor} className="px-4 py-2 text-left border-b">{col.Header}</th>
              ))}
              <th className="px-4 py-2 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkOuts.map((checkOut) => (
              <tr key={checkOut.id} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-2 border-b">
                    {displayData(checkOut,col.accessor.trim())}
                  </td>
                ))}
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => {
                    }}
                    className="text-blue-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => { setCheckOutID(checkOut.id); setShowDeletePopup(true); }}
                    className="text-blue-500"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => deleteCheckOut()}
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Checkout Form Popup */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add a New Checkout</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addCheckOut();
            }}>
              <input
                type="text"
                required
                minLength={36}
                maxLength={36}
                value={checkOutData.book_book_id }
                onChange={(e) => setCheckOutData({ ...checkOutData, book_book_id : e.target.value })}
                placeholder="Book ID"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="text"
                required
                minLength={36}
                maxLength={36}
                value={checkOutData.person_personid}
                onChange={(e) => setCheckOutData({ ...checkOutData, person_personid: e.target.value })}
                placeholder="Person ID"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="date"
                required
                value={checkOutData.check_out_date}
                onChange={(e) => setCheckOutData({ ...checkOutData, check_out_date: e.target.value })}
                placeholder="Quantity"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-md mr-2">
                  Add Checkout
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutPage;