import React, { useState } from "react";

const AddBook = ({ setaddBook }) => {
const [books, setBooks] = useState([]);
const [form, setForm] = useState({
title: "",
isbn: "",
author: "",
genre: "",
availability: "",
price: "",
});

const handleChange = (e) => {
const { name, value } = e.target;
setForm({ ...form, [name]: value });
};

const handleSubmit = (e) => {
e.preventDefault();
if (!form.title || !form.author || !form.price) {
alert("Please fill all required fields!");
return;
}
setBooks([...books, { ...form, id: Date.now() }]);
setForm({
title: "",
isbn: "",
author: "",
genre: "",
availability: "",
price: "",
});
};

const handleDelete = (id) => {
setBooks(books.filter((book) => book.id !== id));
};

return ( <div className="relative p-8 bg-gray-50">
{/* ❌ Close Button */}
<button
onClick={() =>{setaddBook(false)}}
className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
type="button"
>
× </button>

  <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add New Book</h1>

  {/* Form Section */}
  <form
    onSubmit={handleSubmit}
    className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
  >
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
      name="availability"
      placeholder="Availability (e.g. 3/3)"
      value={form.availability}
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

    <button
      type="submit"
      className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      Add Book
    </button>
  </form>
</div>
);
};

export default AddBook;
