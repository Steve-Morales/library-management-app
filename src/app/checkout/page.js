'use client'

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../navbar';

const CheckOutPage = () => {
  const [checkOuts, setCheckOuts] = useState([]);
  const [checkOutData, setCheckOutData] = useState({ book_book_id: '', person_personid: '', check_out_date: '' });
  const [checkOutID, setCheckOutID] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteSelect, setShowDeleteSelect] = useState(false);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);


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
      .then(response => {
        setCheckOuts(response.data);
        setIsLoading(false);
      })
      .catch(error => console.error('Error fetching checkouts:', error));
  };

  const getCheckOut = () => {
    axios.get(`http://localhost:8086/api/checkouts/${checkOutID}`)
      .then(response => {
        let responseData = response.data;
        console.log(responseData);
        responseData.book_book_id = responseData.book_book_id.book_id;
        responseData.person_personid = responseData.person_personid.personID;
        responseData.check_out_date = formatDateReverse(formatDate(responseData.check_out_date));
        setCheckOutData(responseData);
      })
      .catch(error => console.error('Error fetching checkout via id:', error));
  };

  const addCheckOut = () => {
    console.log(checkOutData);
    axios.post('http://localhost:8086/api/checkouts', checkOutData)
      .then((response) => {
        setCheckOuts([...checkOuts, response.data]);
        setShowAddForm(false);
        setCheckOutData({ book_book_id: '', person_personid: '', check_out_date: '' });
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

  const formatDateReverse = (date) => {
    if (!date) return "";
    const [month, day, year] = date.split("/");
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  const displayData = (checkOut, accessor) => {

    if (accessor === 'book_book_id') { return checkOut[accessor].book_id; }
    else if (accessor === 'person_personid') { return checkOut[accessor].personID; }
    else if (accessor === 'check_out_date') { return formatDate(checkOut[accessor]); }
    return checkOut[accessor]; // id or null
  }

  const deleteAllSelected = () => {
    let idList = deleteList;
    for (let i = 0; i < idList.length; i++) {
      let current_checkout_id = idList[i];
      axios.delete(`http://localhost:8086/api/checkouts/${current_checkout_id}`).then((res) => {
        console.log(res.data);
        setDeleteList(prevItems => prevItems.filter(item => item !== current_checkout_id));
        setCheckOuts(prevItems => prevItems.filter(item => item.id !== current_checkout_id));
      });
    }

  }


  return (
    <div className="text-black">
      <Navbar />
      <h1 className="text-4xl font-semibold text-center mb-6">CheckOut</h1>

      <h1 className="text-3xl font-bold text-center mb-8">CheckOut Management</h1>
      <div className="flex justify-end items-center space-x-2">
        {/* Delete Checkouts Button */}
        {!showDeleteSelect && <button
          onClick={() => setShowDeleteSelect(true)}
          className="px-4 py-2 bg-red-500 text-white rounded-full mb-4"
        >
          -
        </button>}
        {showDeleteSelect &&
          <div className="space-x-2">
            <button
              onClick={() => setShowConfirmDeleteAll(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-full mb-4"
            >
              Delete All
            </button>
            <button
              onClick={() => setShowDeleteSelect(false)}
              className="px-4 py-2 bg-slate-600 text-white rounded-full mb-4"
            >
              Cancel
            </button>
          </div>

        }
        {/* Add Checkout Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full mb-4"
        >
          +
        </button>
      </div>

      {/* Loading Spinner */}
      {isLoading &&
        <div className="flex justify-center items-center min-w-full max-w-full table-auto border-collapse bg-white text-black rounded-md">
          <div role="status" className="">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>

      }

      {/* Display All Checkouts */}
      {!isLoading &&
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
                      {displayData(checkOut, col.accessor.trim())}
                    </td>
                  ))}
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => {
                        setCheckOutID(checkOut.id);
                        getCheckOut();
                        setCheckOutData(checkOut);
                        setShowEditForm(true);
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

                    {showDeleteSelect &&
                      <div className="inline">
                        <input type="checkbox" onChange={(e) => {
                          if (true == e.target.checked) { setDeleteList([...deleteList, checkOut.id]); }
                          else if (false == e.target.checked) { setDeleteList(prevItems => prevItems.filter(item => item !== checkOut.id)); }
                        }} />
                      </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {/* Edit Book Form Popup */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Checkout Date</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateBook();
            }}>
              <input
                type="text"
                required
                minLength={36}
                maxLength={36}
                value={checkOutData.book_book_id}
                onChange={(e) => setCheckOutData({ ...checkOutData, book_book_id: e.target.value })}
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

              {/* Other input fields go here */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                >
                  Update Checkout
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                value={checkOutData.book_book_id}
                onChange={(e) => setCheckOutData({ ...checkOutData, book_book_id: e.target.value })}
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

      {/* Confirm Delete All Popup */}
      {showConfirmDeleteAll && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              // updateBook();
              deleteAllSelected();
              setShowConfirmDeleteAll(false);
            }}>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                >
                  Delete All Selected
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDeleteAll(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
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