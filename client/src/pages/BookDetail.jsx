import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookService } from '../services/bookService'
import { borrowService } from '../services/borrowService'
import { groupService } from '../services/groupService'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

const BookDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [userGroup, setUserGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await bookService.getBook(id)
        setBook(response.data.data.book)
      } catch (error) {
        toast.error('Failed to load book details')
        navigate('/books')
      } finally {
        setLoading(false)
      }
    }

    const fetchUserGroup = async () => {
      try {
        const response = await groupService.getMyGroup()
        setUserGroup(response.data.data.group)
      } catch (error) {
        // User might not be in a group
        setUserGroup(null)
      }
    }

    fetchBookDetails()
    fetchUserGroup()
  }, [id, navigate])

  const handleBorrowIndividual = async () => {
    try {
      setBorrowing(true)
      await borrowService.borrowIndividual(id)
      toast.success('Book borrowed successfully!')
      navigate('/my-books')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book')
    } finally {
      setBorrowing(false)
    }
  }

  const handleBorrowGroup = async () => {
    try {
      setBorrowing(true)
      await borrowService.borrowGroup(id, userGroup._id)
      toast.success('Book borrowed for group successfully!')
      navigate('/my-books')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book')
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Book not found</h2>
        <p className="mt-2 text-gray-600">The book you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            {book.coverImage ? (
              <img
                className="h-64 w-full object-cover md:h-full"
                src={book.coverImage}
                alt={book.title}
              />
            ) : (
              <div className="h-64 w-full bg-gray-200 flex items-center justify-center md:h-full">
                <span className="text-6xl text-gray-400">📖</span>
              </div>
            )}
          </div>
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">ISBN</dt>
                <dd className="text-sm text-gray-900">{book.isbn}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Genre</dt>
                <dd className="text-sm text-gray-900">{book.genre}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Publisher</dt>
                <dd className="text-sm text-gray-900">{book.publisher}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Year</dt>
                <dd className="text-sm text-gray-900">{book.publicationYear}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Language</dt>
                <dd className="text-sm text-gray-900">{book.language}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Pages</dt>
                <dd className="text-sm text-gray-900">{book.pages || 'N/A'}</dd>
              </div>
            </div>

            <div className="mb-6">
              <dt className="text-sm font-medium text-gray-500 mb-2">Description</dt>
              <dd className="text-sm text-gray-900">{book.description}</dd>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  book.availableCopies > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.availableCopies > 0 
                    ? `${book.availableCopies} copies available` 
                    : 'Not available'
                  }
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">₹{book.price}</div>
                <div className="text-sm text-gray-500">Book price</div>
              </div>
            </div>

            {book.availableCopies > 0 ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <button
                    onClick={handleBorrowIndividual}
                    disabled={borrowing}
                    className="w-full btn-primary"
                  >
                    {borrowing ? 'Borrowing...' : 'Borrow Individually (30 days)'}
                  </button>
                  
                  {userGroup && (
                    <button
                      onClick={handleBorrowGroup}
                      disabled={borrowing}
                      className="w-full btn-secondary"
                    >
                      {borrowing ? 'Borrowing...' : `Borrow for Group: ${userGroup.name} (180 days)`}
                    </button>
                  )}
                </div>

                {/* Borrowing Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Borrowing Rules</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Individual: 30 days, Group: 180 days</li>
                    <li>• One book per person/group at a time</li>
                    <li>• Late returns = 200% book price + ₹50/day</li>
                    <li>• Group members cannot borrow individually while group has a book</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">This book is currently not available for borrowing.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
