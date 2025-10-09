import React from 'react'

const BorrowedBooksModal = ({ books = [], onClose }) => {
  // Handle case when books is undefined or not an array
  if (!Array.isArray(books)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 text-center">
          <h2 className="text-xl font-bold mb-4">Borrowed Books</h2>
          <p className="text-gray-500">No borrowed books found.</p>
          <button onClick={onClose} className="btn-outline w-full mt-4">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Borrowed Books</h2>

        {books.length > 0 ? (
          <ul>
            {books.map((book) => (
              <li key={book._id || Math.random()} className="mb-2 border-b pb-2">
                <strong>{book.title}</strong>
                <p className="text-sm text-gray-500">
                  Borrowed by {book.borrower?.name || 'Unknown'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No borrowed books found.</p>
        )}

        <button onClick={onClose} className="btn-outline w-full mt-4">
          Close
        </button>
      </div>
    </div>
  )
}

export default BorrowedBooksModal
