'use client'
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Navbar from '../navbar';

const PeoplePage = () => {
  const [people, setPeople] = useState([]);
  const [personData, setPersonData] = useState({ name: "", address: "", phoneNumber: "" });
  //const [updatePerson, setUpdatePerson] = useState({ name: "", address: "", phoneNumber: "" });
  const [personID, setPersonID] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const columns = useMemo(() => [
    { Header: 'PersonID', accessor: 'personID' },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Address', accessor: 'address' },
    { Header: 'Phone Number', accessor: 'phoneNumber' },
  ], []);
  useEffect(() => {
    getPersonList();
  }, []);

  const getPersonList = () => {
    // Fetch all people on component mount
    axios.get('http://localhost:8086/api/people')
      .then(response => setPeople(response.data))
      .catch(error => console.error('Error fetching people:', error));
  };

  const getPerson = () => {
    axios.get('http://localhost:8086/api/people/', personID)
      .then(response => {console.log(response.data); setPersonData(response.data);})
      .catch(error => console.error('Error fetching people:', error));
  };

  const addPerson = () => {
    console.log(personData);
    axios.post('http://localhost:8086/api/people', personData)
      .then(response => {
        setPeople([...people, response.data]);
        setPersonData({ name: "", address: "", phoneNumber: "" });  // Clear the input fields
      })
      .catch(error => console.error('Error adding person:', error));
  };

  const updatePerson = () => {
    axios.put(`http://localhost:8086/api/people/${personID}`, personData)
      .then(response => {
        const updatedPeople = people.map(person =>
          person.id === updatePerson.id ? response.data : person
        );
        setPeople(updatedPeople);
        setPersonData({ name: "", address: "", phoneNumber: "" });  // Clear the input fields
        setShowEditForm(false);
      })
      .catch(error => console.error('Error updating person:', error));
  };

  const deletePerson = () => {
    setShowDeletePopup(false);
    axios.delete(`http://localhost:8086/api/people/${personID}`)
      .then((res) => {
        console.log(res.data)
        setPeople(people.filter(person => person.personID !== personID));
      })
      .catch(error => console.error('Error deleting person:', error));
  };

  return (
    <div className="text-black max-w-3xl mx-auto p-6">
      <Navbar/>
      <h1 className="text-4xl font-semibold text-center mb-6">People</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-medium mb-4">Add New Person</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          addPerson();  // Call the addPerson function when the form is submitted
        }}>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              required
              minLength={2}
              maxLength={100}
              placeholder="Name"
              className="border border-gray-300 p-2 rounded-md w-full"
              value={personData.name}
              onChange={(e) => setPersonData({ ...personData, name: e.target.value })}
            />
            <input
              type="text"
              minLength={2}
              maxLength={150}
              placeholder="Address"
              className="border border-gray-300 p-2 rounded-md w-full"
              value={personData.address}
              onChange={(e) => setPersonData({ ...personData, address: e.target.value })}
            />
            <input
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9\s]{10,10}"
              minLength={10}
              maxLength={15}
              placeholder="Phone Number"
              className="border border-gray-300 p-2 rounded-md w-full"
              value={personData.phoneNumber}
              onChange={(e) => setPersonData({ ...personData, phoneNumber: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Add Person
            </button>
            <button
              type="button"
              onClick={() => setPersonData({ name: '', address: '', phoneNumber: '' })}
              className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>


      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-medium mb-4">Update Person</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              updatePerson();  // Call the addPerson function when the form is submitted
            }}>
              <div className="flex space-x-4 mb-4">
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Name"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={personData.name}
                  onChange={(e) => setPersonData({ ...personData, name: e.target.value })}
                />
                <input
                  type="text"
                  minLength={2}
                  maxLength={150}
                  placeholder="Address"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={personData.address}
                  onChange={(e) => setPersonData({ ...personData, address: e.target.value })}
                />
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="[0-9\s]{10,10}"
                  minLength={10}
                  maxLength={15}
                  placeholder="Phone Number"
                  className="border border-gray-300 p-2 rounded-md w-full"
                  value={personData.phoneNumber}
                  onChange={(e) => setPersonData({ ...personData, phoneNumber: e.target.value })}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md ml-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>)}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-medium mb-4">All People</h2>
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
            {people.map((person) => (
              <tr key={person.personID} className="hover:bg-gray-100">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-2 border-b">
                    {person[col.accessor]}
                  </td>
                ))}
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => {
                      setPersonID(person.personID);
                      getPerson();
                      setPersonData(person);
                      setShowEditForm(true);
                    }}
                    className="text-blue-500"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => { setPersonID(person.personID); setShowDeletePopup(true); }}
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

      {/* Delete Book Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this book?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={deletePerson}
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


    </div>
  );
};

export default PeoplePage;
