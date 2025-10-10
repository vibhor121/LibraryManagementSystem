import { useState, useEffect } from 'react'
import { bookService } from '../../services/bookService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import AddBook from '../../components/Addbook'
// const AdminBooks = () => {
//   const [books, setBooks] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [addbook,setaddBook]=useState(false);

//   useEffect(() => {
//     fetchBooks()
//   }, [])

//   const fetchBooks = async () => {
//     try {
//       setLoading(true)
//       const response = await bookService.getBooks({ limit: 50 })
//       setBooks(response.data.data.books)
//     } catch (error) {
//       toast.error('Failed to load books')
//       console.error('Books error:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return <LoadingSpinner size="lg" className="mt-8" />
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
//               <p className="mt-1 text-sm text-gray-500">
//                 Add, edit, and manage the book catalog
//               </p>
//             </div>
//             <button className="btn-primary" onClick={()=>{setaddBook(true)}}>
//               <PlusIcon className="h-5 w-5 mr-2" />
//               Add Book
//             </button>
//           </div>
//         </div>
//       </div>

//       {addbook ? <AddBook className="fixed top-2" setaddBook={setaddBook}/>:<h1></h1>} 

//       {/* Books Table */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="px-4 py-5 sm:p-6">
//           {books.length < 1 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">📚</div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
//               <p className="text-gray-500">
//                 Start by adding books to the catalog.
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Book
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Author
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Genre
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Availability
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Price
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   { books.map((book) => (
//                     <tr key={book._id}>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {book.title}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {book.isbn}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {book.author}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {book.genre}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                           book.availableCopies > 0 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {book.availableCopies}/{book.totalCopies}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         ₹{book.price}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <button className="text-primary-600 hover:text-primary-900">
//                             <PencilIcon className="h-4 w-4" />
//                           </button>
//                           <button className="text-red-600 hover:text-red-900">
//                             <TrashIcon className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


// const AdminBooks = () => {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [addBookModal, setAddBookModal] = useState(false);

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const response = await bookService.getBooks({ limit: 50 });
//       setBooks(response.data.data.books);
//     } catch (error) {
//       toast.error("Failed to load books");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBookAdded = (newBook) => {
//     setBooks([newBook, ...books]);
//   };

//   if (loading) return <LoadingSpinner size="lg" className="mt-8" />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
//             <p className="mt-1 text-sm text-gray-500">Add, edit, and manage the book catalog</p>
//           </div>
//           <button
//             className="btn-primary flex items-center"
//             onClick={() => setAddBookModal(true)}
//           >
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add Book
//           </button>
//         </div>
//       </div>

//       {addBookModal && <AddBook setaddBook={setAddBookModal} onBookAdded={handleBookAdded} />}

//       {/* Books Table */}
//       <div className="bg-white shadow rounded-lg overflow-x-auto">
//         {books.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="text-gray-400 text-6xl mb-4">📚</div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
//             <p className="text-gray-500">Start by adding books to the catalog.</p>
//           </div>
//         ) : (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {books.map((book) => (
//                 <tr key={book._id}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center space-x-3">
//                       {book.image ? (
//                         <img src={book.image} alt={book.title} className="h-12 w-12 object-cover rounded border" />
//                       ) : (
//                         <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-sm">N/A</div>
//                       )}
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{book.title}</div>
//                         <div className="text-sm text-gray-500">{book.isbn}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.genre}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//                     }`}>
//                       {book.availableCopies}/{book.totalCopies}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{book.price}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button className="text-primary-600 hover:text-primary-900">
//                         <PencilIcon className="h-4 w-4" />
//                       </button>
//                       <button className="text-red-600 hover:text-red-900">
//                         <TrashIcon className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };


const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addBookModal, setAddBookModal] = useState(false);

  // Fetch all books from backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/books");
      const data = await res.json();

      if (data.success) {
        setBooks(data.data);
      } else {
        toast.error(data.message || "Failed to load books");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add new book to state after adding
  const handleBookAdded = (newBook) => {
    setBooks([newBook, ...books]);
  };

  if (loading) return <LoadingSpinner size="lg" className="mt-8" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
            <p className="mt-1 text-sm text-gray-500">Add, edit, and manage the book catalog</p>
          </div>
          <button
            className="btn-primary flex items-center"
            onClick={() => setAddBookModal(true)}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Book
          </button>
        </div>
      </div>

      {addBookModal && (
        <AddBook setaddBook={setAddBookModal} onBookAdded={handleBookAdded} />
      )}

      {/* Books Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500">Start by adding books to the catalog.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} className="h-12 w-12 object-cover rounded border" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-sm">N/A</div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.isbn}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.genre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      book.availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{book.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default AdminBooks
