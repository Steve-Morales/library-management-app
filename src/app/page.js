'use client'
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [bookList, setBookList] = useState([]);
  const [bookID, setBookID] = useState("");
  const [book, setBook] = useState({ bookID: "", author: "", title: "", published: "", isbn_10: "", isbn_13: "", publisher: "" });
  const [bookData, setBookData] = useState({ author: "", title: "", published: "", isbn_10: "", isbn_13: "", publisher: "" });

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const columns = useMemo(
    () => [
      { Header: "Book ID", accessor: "bookId" },
      { Header: "Author", accessor: "author" },
      { Header: "Title", accessor: "title" },
      { Header: "Published", accessor: "published" },
      { Header: "ISBN 10", accessor: "isbn_10" },
      { Header: "ISBN 13", accessor: "isbn_13" },
      { Header: "Publisher", accessor: "publisher" }
    ],
    []
  );

  const getBooks = () => {
    axios.get("http://localhost:8086/api/books").then((res) => {
      setBookList(res.data);
    });
  };

  const getBook = () => {
    axios.get("http://localhost:8086/api/books", bookID).then((res) => {
      setBook(res.data);
    });
  };

  const addBook = () => {
    console.log(bookData);
    axios.post("http://localhost:8086/api/books", bookData).then((res) => {
      console.log(res.data);
      setShowAddForm(false);
    });
  };

  const updateBook = () => {
    axios.put(`http://localhost:8086/api/books/${bookID}`, bookData).then((res) => {
      console.log(res.data);
      setShowEditForm(false);
    });
  };

  const deleteBook = () => {
    axios.delete(`http://localhost:8086/api/books/${bookID}`).then((res) => {
      console.log(res.data);
      setShowDeletePopup(false);
    });
  };

  useEffect(() => {
    getBooks();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container mx-auto p-4">
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to the App</h1>
        <p>Select a page to manage:</p>
        <ul style={{ listStyleType: 'none' }}>
          <li style={{ margin: '10px' }}>
            <Link href="/people" style={{ color: 'blue', textDecoration: 'underline' }}>
              <p >Go to People Page</p>
            </Link>
          </li>
          <li style={{ margin: '10px', color: 'blue', textDecoration: 'underline' }}>
            <Link href="/checkout">
              <p>Go to CheckOut Page</p>
            </Link>
          </li>
        </ul>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8">Book Management</h1>

      {/* Add Book Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
      >
        Add Book
      </button>

      {/* Table for displaying books */}
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
          {bookList.map((book) => (
            <tr key={book.bookId} className="hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2 border-b">
                  {col.accessor === 'published' ? formatDate(book[col.accessor]) : book[col.accessor]}
                </td>
              ))}
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => {
                    setBookID(book.bookId);
                    getBook();
                    setBookData(book);
                    setShowEditForm(true);
                  }}
                  className="text-blue-500"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    setBookID(book.bookId);
                    setShowDeletePopup(true);
                  }}
                  className="text-blue-500"
                >
                  🗑️
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Book Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this book?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={deleteBook}
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

      {/* Add Book Form Popup */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add a New Book</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addBook();
            }}>
              <input
                type="text"
                required
                minLength={1}
                maxLength={50}
                value={bookData.author}
                onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                placeholder="Author"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="text"
                required
                minLength={1}
                maxLength={100}
                value={bookData.title}
                onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                placeholder="Title"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="date"
                required
                value={bookData.published}
                onChange={(e) => setBookData({ ...bookData, published: e.target.value })}
                placeholder="Published"
                className="w-full p-2 border mb-4 rounded-md"
              />

              <input
                type="text"
                required
                inputMode="numeric"
                pattern="[0-9\s]{10,10}"
                autoComplete="ISBN"
                minLength={10}
                maxLength={10}
                value={bookData.isbn_10}
                onChange={(e) => setBookData({ ...bookData, isbn_10: e.target.value })}
                placeholder="ISBN 10"
                className="w-full p-2 border mb-4 rounded-md"
              />

              {/*ISBN 13 is Optional*/}
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9\s]{13,13}"
                autoComplete="ISBN"
                minLength={13}
                maxLength={13}
                value={bookData.isbn_13}
                onChange={(e) => setBookData({ ...bookData, isbn_13: e.target.value })}
                placeholder="ISBN 13"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="text"
                required
                minLength={1}
                maxLength={50}
                value={bookData.publisher}
                onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
                placeholder="Publisher"
                className="w-full p-2 border mb-4 rounded-md"
              />

              {/* Other input fields go here */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                >
                  Add Book
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

      {/* Edit Book Form Popup */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 text-black">
          <div className="bg-white rounded-md p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Book</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateBook();
            }}>
              <input
                type="text"
                required
                minLength={1}
                maxLength={50}
                value={bookData.author}
                onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                placeholder="Author"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="text"
                required
                minLength={1}
                maxLength={100}
                value={bookData.title}
                onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                placeholder="Title"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="date"
                required
                value={bookData.published}
                onChange={(e) => setBookData({ ...bookData, published: e.target.value })}
                placeholder="Published"
                className="w-full p-2 border mb-4 rounded-md"
              />

              <input
                type="text"
                required
                inputMode="numeric"
                pattern="[0-9\s]{10,10}"
                autoComplete="ISBN"
                minLength={10}
                maxLength={10}
                value={bookData.isbn_10}
                onChange={(e) => setBookData({ ...bookData, isbn_10: e.target.value })}
                placeholder="ISBN 10"
                className="w-full p-2 border mb-4 rounded-md"
              />

              {/*ISBN 13 is Optional*/}
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9\s]{13,13}"
                autoComplete="ISBN 13"
                minLength={13}
                maxLength={13}
                value={bookData.isbn_13}
                onChange={(e) => setBookData({ ...bookData, isbn_13: e.target.value })}
                placeholder="ISBN 13"
                className="w-full p-2 border mb-4 rounded-md"
              />
              <input
                type="text"
                required
                minLength={1}
                maxLength={50}
                value={bookData.publisher}
                onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
                placeholder="Publisher"
                className="w-full p-2 border mb-4 rounded-md"
              />

              {/* Other input fields go here */}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                >
                  Update Book
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
    </div>
  );
}
