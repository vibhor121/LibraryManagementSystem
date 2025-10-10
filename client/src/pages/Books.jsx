import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookService } from '../services/bookService'
import LoadingSpinner from '../components/LoadingSpinner'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'


// const Books = () => {
//   const [books, setBooks] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedGenre, setSelectedGenre] = useState('')
//   const [genres, setGenres] = useState([])
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     hasNext: false,
//     hasPrev: false,
//     totalBooks: 0
//   })

//   const fetchBooks = async (page = 1) => {
//     try {
//       setLoading(true)
//       const params = {
//         page,
//         limit: 12,
//         search: searchTerm || undefined,
//         genre: selectedGenre || undefined,
//       }

//       const response = await bookService.getBooks(params)

//       // ✅ Safely extract data with fallbacks
//       const booksData = response?.data?.data?.books || []
//       const paginationData = response?.data?.data?.pagination || {
//         currentPage: 1,
//         totalPages: 1,
//         hasNext: false,
//         hasPrev: false,
//         totalBooks: booksData.length
//       }

//       setBooks(booksData)
//       setPagination(paginationData)

//       // ✅ Avoid crashing if booksData is empty
//       const uniqueGenres = [...new Set(booksData.map(book => book.genre).filter(Boolean))]
//       setGenres(uniqueGenres)
//     } catch (error) {
//       console.error('Books error:', error)
//       toast.error('Failed to load books')
//       setBooks([]) // fallback to empty list
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Initial fetch
//   useEffect(() => {
//     fetchBooks()
//   }, [])

//   const handleSearch = (e) => {
//     e.preventDefault()
//     fetchBooks(1)
//   }

//   const handleGenreChange = (genre) => {
//     setSelectedGenre(genre)
//     fetchBooks(1)
//   }

//   if (loading) {
//     return <LoadingSpinner size="lg" className="mt-8" />
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <h1 className="text-2xl font-bold text-gray-900">Book Catalog</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Browse and search our collection of books
//           </p>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <form onSubmit={handleSearch} className="space-y-4">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex-1 relative">
//                 <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search books by title, author, or description..."
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <button type="submit" className="btn-primary">
//                 Search
//               </button>
//             </div>
//           </form>

//           {/* Genre Filter */}
//           <div className="mt-4 flex flex-wrap gap-2">
//             <button
//               onClick={() => handleGenreChange('')}
//               className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 selectedGenre === ''
//                   ? 'bg-primary-100 text-primary-800'
//                   : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//               }`}
//             >
//               All Genres
//             </button>
//             {genres.map((genre) => (
//               <button
//                 key={genre}
//                 onClick={() => handleGenreChange(genre)}
//                 className={`px-3 py-1 rounded-full text-sm font-medium ${
//                   selectedGenre === genre
//                     ? 'bg-primary-100 text-primary-800'
//                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                 }`}
//               >
//                 {genre}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Books Grid */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           {books.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">📚</div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
//               <p className="text-gray-500">
//                 Try adjusting your search criteria or browse all books.
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                 {books.map((book) => (
//                   <div
//                     key={book._id}
//                     className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
//                   >
//                     <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-t-lg overflow-hidden">
//                       {book.coverImage ? (
//                         <img
//                           src={book.coverImage}
//                           alt={book.title}
//                           className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
//                         />
//                       ) : (
//                         <div className="w-full h-48 flex items-center justify-center bg-gray-100">
//                           <span className="text-4xl text-gray-400">📖</span>
//                         </div>
//                       )}
//                     </div>
//                     <div className="p-4">
//                       <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
//                         {book.title}
//                       </h3>
//                       <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
//                       <p className="text-xs text-gray-500 mb-3">
//                         {book.genre} • {book.publicationYear}
//                       </p>
//                       <div className="flex items-center justify-between">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             book.availableCopies > 0
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                         >
//                           {book.availableCopies > 0
//                             ? `${book.availableCopies} available`
//                             : 'Not available'}
//                         </span>
//                         <span className="text-sm font-medium text-gray-900">
//                           ₹{book.price}
//                         </span>
//                       </div>
//                       <div className="mt-3">
//                         <Link to={`/books/${book._id}`} className="w-full btn-primary text-center block">
//                           View Details
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Pagination */}
//               {pagination?.totalPages > 1 && (
//                 <div className="mt-8 flex items-center justify-between">
//                   <div className="text-sm text-gray-700">
//                     Showing {((pagination.currentPage - 1) * 12) + 1} to{' '}
//                     {Math.min(pagination.currentPage * 12, pagination.totalBooks)} of{' '}
//                     {pagination.totalBooks} results
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => fetchBooks(pagination.currentPage - 1)}
//                       disabled={!pagination.hasPrev}
//                       className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => fetchBooks(pagination.currentPage + 1)}
//                       disabled={!pagination.hasNext}
//                       className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
    totalBooks: 0
  })

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 12,
        search: searchTerm || undefined,
        genre: selectedGenre || undefined,
      }

      const response = await bookService.getBooks(params)
      const booksData = response?.data?.data?.books || []
      const paginationData = response?.data?.data?.pagination || {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        totalBooks: booksData.length
      }

      setBooks(booksData)
      setPagination(paginationData)
      const uniqueGenres = [...new Set(booksData.map(book => book.genre).filter(Boolean))]
      setGenres(uniqueGenres)
    } catch (error) {
      console.error('Books error:', error)
      toast.error('Failed to load books')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks(1)
  }

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
    fetchBooks(1)
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-1 tracking-tight">Book Catalog</h1>
        <p className="text-sm text-indigo-100">Browse and discover amazing books curated for you</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow transition-all"
          >
            Search
          </button>
        </form>

        {/* Genre Filter */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreChange('')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedGenre === ''
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreChange(genre)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedGenre === genre
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-6">
        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500">Try a different search or genre filter.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="group bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="overflow-hidden relative">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-56 flex items-center justify-center bg-gray-100">
                        <span className="text-5xl text-gray-400">📖</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-0.5 rounded text-xs font-medium text-gray-700">
                      {book.genre}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <p className="text-xs text-gray-500 mb-3">{book.publicationYear}</p>

                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          book.availableCopies > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {book.availableCopies > 0
                          ? `${book.availableCopies} available`
                          : 'Not available'}
                      </span>
                      <span className="text-sm font-semibold text-indigo-700">₹{book.price}</span>
                    </div>

                    <Link
                      to={`/books/${book._id}`}
                      className="block text-center w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition-all font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-700 gap-3">
                <p>
                  Showing {((pagination.currentPage - 1) * 12) + 1}–{Math.min(pagination.currentPage * 12, pagination.totalBooks)} of{' '}
                  {pagination.totalBooks} books
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchBooks(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchBooks(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}



export default Books
