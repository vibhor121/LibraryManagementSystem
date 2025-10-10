import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const EditBookModal = ({ book, onClose, onBookUpdated }) => {
  const [form, setForm] = useState({
    title: "",
    isbn: "",
    author: "",
    genre: "",
    description: "",
    price: "",
    publicationYear: "",
    publisher: "",
    language: "English",
    pages: "",
    totalCopies: 1,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Populate form with existing book data
  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        isbn: book.isbn || "",
        author: book.author || "",
        genre: book.genre || "",
        description: book.description || "",
        price: book.price || "",
        publicationYear: book.publicationYear || "",
        publisher: book.publisher || "",
        language: book.language || "English",
        pages: book.pages || "",
        totalCopies: book.totalCopies || 1,
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const requiredFields = ["title", "author", "price", "description", "publicationYear", "publisher"];
    for (const field of requiredFields) {
      if (!form[field]) {
        toast.error(`Please fill ${field}`);
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Append all text fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append cover image file if selected
      if (imageFile) formData.append("coverImage", imageFile);

      // Get JWT token from localStorage
      const token = localStorage.getItem("token");

      // Send PUT request to API
      const res = await fetch(`http://localhost:5000/api/books/${book._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (data.success) {
        toast.success(data.message || "Book updated successfully!");
        onBookUpdated(data.data); // pass updated book to parent
        onClose(); // close modal
      } else {
        toast.error(data.message || "Failed to update book");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while updating the book");
    } finally {
      setLoading(false);
    }
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 mt-10 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit Book</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            name="title" 
            placeholder="Book Title" 
            value={form.title} 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required 
          />
          <input 
            type="text" 
            name="isbn" 
            placeholder="ISBN Number" 
            value={form.isbn} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="author" 
            placeholder="Author" 
            value={form.author} 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required 
          />
          <input 
            type="text" 
            name="genre" 
            placeholder="Genre" 
            value={form.genre} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="text" 
            name="publisher" 
            placeholder="Publisher" 
            value={form.publisher} 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required 
          />
          <input 
            type="number" 
            name="publicationYear" 
            placeholder="Publication Year" 
            value={form.publicationYear} 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required 
          />
          <input 
            type="number" 
            name="totalCopies" 
            placeholder="Total Copies" 
            value={form.totalCopies} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="number" 
            name="price" 
            placeholder="Price (₹)" 
            value={form.price} 
            onChange={handleChange} 
            className="border p-2 rounded" 
            required 
          />
          <input 
            type="text" 
            name="language" 
            placeholder="Language" 
            value={form.language} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <input 
            type="number" 
            name="pages" 
            placeholder="Pages" 
            value={form.pages} 
            onChange={handleChange} 
            className="border p-2 rounded" 
          />
          <textarea 
            name="description" 
            placeholder="Description" 
            value={form.description} 
            onChange={handleChange} 
            className="border p-2 rounded md:col-span-2" 
            required 
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files[0])} 
              className="border p-2 rounded w-full"
            />
            {book.coverImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current cover:</p>
                <img 
                  src={book.coverImage} 
                  alt="Current cover" 
                  className="h-20 w-20 object-cover rounded border mt-1"
                />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBookModal;

