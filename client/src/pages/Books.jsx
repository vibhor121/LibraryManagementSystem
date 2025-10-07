import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookService } from '../services/bookService'
import LoadingSpinner from '../components/LoadingSpinner'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Books = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        setLoading(true)
        const params = {
          page: 1,
          limit: 12,
          search: searchTerm || undefined,
          genre: selectedGenre || undefined
        }
        
        const response = await bookService.getBooks(params)
        setBooks(response.data.data.books)
        setPagination(response.data.data.pagination)
        
        // Extract unique genres for filter
        const uniqueGenres = [...new Set(response.data.data.books.map(book => book.genre))]
        setGenres(uniqueGenres)
      } catch (error) {
        toast.error('Failed to load books')
        console.error('Books error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooksData()
  }, [])

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 12,
        search: searchTerm || undefined,
        genre: selectedGenre || undefined
      }
      
      const response = await bookService.getBooks(params)
      setBooks(response.data.data.books)
      setPagination(response.data.data.pagination)
      
      // Extract unique genres for filter
      const uniqueGenres = [...new Set(response.data.data.books.map(book => book.genre))]
      setGenres(uniqueGenres)
    } catch (error) {
      toast.error('Failed to load books')
      console.error('Books error:', error)
    } finally {
      setLoading(false)
    }
  }

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">Book Catalog</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and search our collection of books
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search books by title, author, or description..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
              >
                Search
              </button>
            </div>
          </form>

          {/* Genre Filter */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleGenreChange('')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedGenre === '' 
                    ? 'bg-primary-100 text-primary-800' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedGenre === genre 
                      ? 'bg-primary-100 text-primary-800' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {books.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or browse all books.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => (
                  <div key={book._id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-t-lg overflow-hidden">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                          <span className="text-4xl text-gray-400">📖</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        by {book.author}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {book.genre} • {book.publicationYear}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          book.availableCopies > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableCopies > 0 
                            ? `${book.availableCopies} available` 
                            : 'Not available'
                          }
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{book.price}
                        </span>
                      </div>
                      <div className="mt-3">
                        <Link
                          to={`/books/${book._id}`}
                          className="w-full btn-primary text-center block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.currentPage - 1) * 12) + 1} to{' '}
                    {Math.min(pagination.currentPage * 12, pagination.totalBooks)} of{' '}
                    {pagination.totalBooks} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchBooks(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => fetchBooks(pagination.currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}

export default Books
