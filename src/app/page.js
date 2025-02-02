'use client'
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

import Navbar from "./navbar";
import LoadingSpinner from "./.Components/LoadingSpinner";

export default function Home() {
  const [bookList, setBookList] = useState([]);
  const [book_id, setBook_id] = useState("");
  const [book, setBook] = useState({ book_id: "", author: "", title: "", published: "", isbn_10: "", isbn_13: "", publisher: "" });
  const [bookData, setBookData] = useState({ author: "", title: "", published: "", isbn_10: "", isbn_13: "", publisher: "" });

  const [isISBN13, setIsISBN13] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteSelect, setShowDeleteSelect] = useState(false);
  const [deleteList, setDeleteList] = useState([]);
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(
    () => [
      { Header: "Book ID", accessor: "book_id" },
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
      // console.log(res.data);
      setBookList(res.data);
      setIsLoading(false);
    });
  };

  const getBook = () => {
    axios.get("http://localhost:8086/api/books", book_id).then((res) => {
      setBook(res.data);
    });
  };

  const addBook = () => {
    if (false == isISBN13) { setBookData({ ...bookData, isbn_13: ("978" + bookData.isbn_10) }); }
    axios.post("http://localhost:8086/api/books", bookData).then((res) => {
      console.log(res.data);
      setShowAddForm(false);
    });
  };

  const updateBook = () => {
    axios.put(`http://localhost:8086/api/books/${book_id}`, bookData).then((res) => {
      console.log(res.data);
      setShowEditForm(false);
    });
  };

  const deleteBook = () => {
    axios.delete(`http://localhost:8086/api/books/${book_id}`).then((res) => {
      console.log(res.data);
      setShowDeletePopup(false);
    });
  };

  const deleteAllSelected = () => {
    let idList = deleteList;
    for (let i = 0; i < idList.length; i++) {
      let current_book_id = idList[i];
      axios.delete(`http://localhost:8086/api/books/${current_book_id}`).then((res) => {
        console.log(res.data);
        setDeleteList(prevItems => prevItems.filter(item => item !== current_book_id));
      });
    }

  }

  useEffect(() => {
    getBooks();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div className="">
      <Navbar />

      <h1 className="text-3xl font-bold text-center mb-8">Book Management</h1>
      <div className="flex justify-end items-center space-x-2">
        {/* Delete Books Button */}
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
        {/* Add Book Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-full mb-4"
        >
          +
        </button>
      </div>


      {/* Table for displaying books */}
      {!isLoading && <table className="min-w-full table-auto border-collapse bg-white text-black rounded-md">
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
            <tr key={book.book_id} className="hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col.accessor} className="px-4 py-2 border-b">
                  {col.accessor === 'published' ? formatDate(book[col.accessor]) : book[col.accessor]}
                </td>
              ))}
              <td className="px-4 py-2 border-b items-center">
                <button
                  onClick={() => {
                    setBook_id(book.book_id);
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
                    setBook_id(book.book_id);
                    setShowDeletePopup(true);
                  }}
                  className="text-blue-500"
                >
                  🗑️
                </button>

                {showDeleteSelect &&
                  <div className="inline">
                    <input type="checkbox" onChange={(e) => {
                      if (true == e.target.checked) { setDeleteList([...deleteList, book.book_id]); }
                      else if (false == e.target.checked) { setDeleteList(prevItems => prevItems.filter(item => item !== book.book_id)); }
                    }} />
                  </div>
                }

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      }

      {isLoading &&
        <LoadingSpinner />
      }


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
              <p className="font-bold">Author</p>
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

              <p className="font-bold">Title</p>
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

              <p className="font-bold">Publisher</p>
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
              <p className="font-bold">Published Date</p>
              <input
                type="date"
                required
                value={bookData.published}
                onChange={(e) => setBookData({ ...bookData, published: e.target.value })}
                placeholder="Published"
                className="w-full p-2 border mb-4 rounded-md"
              />


              <div className="relative w-2/3 bg-gray-800 text-white p-1 flex items-center rounded-md my-2">
                <motion.div
                  className="absolute top-0 bottom-0 w-1/2 bg-gray-600 rounded-md"
                  animate={{ x: isISBN13 ? "100%" : "0%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
                <button
                  className="relative z-10 flex-1 text-center p-2"
                  onClick={() => setIsISBN13(false)}
                >
                  ISBN-10
                </button>
                <button
                  className="relative z-10 flex-1 text-center p-2"
                  onClick={() => setIsISBN13(true)}
                >
                  ISBN-13
                </button>
              </div>

              <input
                type="text"
                required
                inputMode="numeric"
                pattern={isISBN13 ? "[0-9\s]{13,13}" : "[0-9\s]{10,10}"}
                autoComplete="ISBN"
                minLength={isISBN13 ? 13 : 10}
                maxLength={isISBN13 ? 13 : 10}
                value={isISBN13 ? bookData.isbn_13 : bookData.isbn_10}
                onChange={(e) => {
                  if (isISBN13) {
                    setBookData({ ...bookData, isbn_13: e.target.value });

                  }
                  else {
                    setBookData({ ...bookData, isbn_10: e.target.value });
                  }
                }}
                placeholder={isISBN13 ? "ISBN 13" : "ISBN 10"}
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

      {/* Edit Book Form Popup */}
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
}
