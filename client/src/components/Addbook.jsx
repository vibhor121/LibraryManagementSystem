import React, { useState } from "react";

// const AddBook = ({ setaddBook }) => {
// const [books, setBooks] = useState([]);
// const [form, setForm] = useState({
// title: "",
// isbn: "",
// author: "",
// genre: "",
// availability: "",
// price: "",
// });

// const handleChange = (e) => {
// const { name, value } = e.target;
// setForm({ ...form, [name]: value });
// };

// const handleSubmit = (e) => {
// e.preventDefault();
// if (!form.title || !form.author || !form.price) {
// alert("Please fill all required fields!");
// return;
// }
// setBooks([...books, { ...form, id: Date.now() }]);
// setForm({
// title: "",
// isbn: "",
// author: "",
// genre: "",
// availability: "",
// price: "",
// });
// };

// const handleDelete = (id) => {
// setBooks(books.filter((book) => book.id !== id));
// };

// return ( <div className="relative p-8 bg-gray-50">
// {/* ❌ Close Button */}
// <button
// onClick={() =>{setaddBook(false)}}
// className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
// type="button"
// >
// × </button>

//   <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add New Book</h1>

//   {/* Form Section */}
//   <form
//     onSubmit={handleSubmit}
//     className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
//   >
//     <input
//       type="text"
//       name="title"
//       placeholder="Book Title"
//       value={form.title}
//       onChange={handleChange}
//       className="border p-2 rounded"
//       required
//     />
//     <input
//       type="text"
//       name="isbn"
//       placeholder="ISBN Number"
//       value={form.isbn}
//       onChange={handleChange}
//       className="border p-2 rounded"
//     />
//     <input
//       type="text"
//       name="author"
//       placeholder="Author"
//       value={form.author}
//       onChange={handleChange}
//       className="border p-2 rounded"
//       required
//     />
//     <input
//       type="text"
//       name="genre"
//       placeholder="Genre"
//       value={form.genre}
//       onChange={handleChange}
//       className="border p-2 rounded"
//     />
//     <input
//       type="text"
//       name="availability"
//       placeholder="Availability (e.g. 3/3)"
//       value={form.availability}
//       onChange={handleChange}
//       className="border p-2 rounded"
//     />
//     <input
//       type="number"
//       name="price"
//       placeholder="Price (₹)"
//       value={form.price}
//       onChange={handleChange}
//       className="border p-2 rounded"
//       required
//     />

//     <button
//       type="submit"
//       className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//     >
//       Add Book
//     </button>
//   </form>
// </div>
// );
// };


// const AddBook = ({ setaddBook, onBookAdded }) => {
//   const [form, setForm] = useState({
//     title: "",
//     isbn: "",
//     author: "",
//     genre: "",
//     description: "",
//     price: "",
//     publicationYear: "",
//     publisher: "",
//     language: "English",
//     pages: "",
//     totalCopies: 1,
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!form.title || !form.author || !form.price || !form.description || !form.publicationYear || !form.publisher) {
//       toast.error("Please fill all required fields!");
//       return;
//     }

//     setLoading(true);

//     try {
//       let coverImageUrl = "";
//       if (imageFile) {
//         const formData = new FormData();
//         formData.append("image", imageFile);
//         const res = await fetch("http://localhost:5000/api/upload", {
//           method: "POST",
//           body: formData,
//         });
//         const data = await res.json();
//         if (data.success) coverImageUrl = data.url;
//         else toast.error("Image upload failed");
//       }

//       // Prepare book payload
//       const bookData = {
//         ...form,
//         price: parseFloat(form.price),
//         publicationYear: parseInt(form.publicationYear),
//         totalCopies: parseInt(form.totalCopies),
//         availableCopies: parseInt(form.totalCopies),
//         borrowedCopies: 0,
//         coverImage: coverImageUrl, // backend expects this field
//       };

//       const response = await bookService.createBook(bookData);
//       toast.success("Book added successfully!");
//       onBookAdded(response.data.data.book);
//       setaddBook(false);
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to add book");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
//       <div className="bg-white rounded-lg p-6 mt-10 w-full max-w-md shadow-lg relative">
//         <button
//           onClick={() => setaddBook(false)}
//           className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
//         >
//           ×
//         </button>
//         <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add New Book</h1>
//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input type="text" name="title" placeholder="Book Title" value={form.title} onChange={handleChange} className="border p-2 rounded" required />
//           <input type="text" name="isbn" placeholder="ISBN Number" value={form.isbn} onChange={handleChange} className="border p-2 rounded" />
//           <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border p-2 rounded" required />
//           <input type="text" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} className="border p-2 rounded" />
//           <input type="text" name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} className="border p-2 rounded" required />
//           <input type="number" name="publicationYear" placeholder="Publication Year" value={form.publicationYear} onChange={handleChange} className="border p-2 rounded" required />
//           <input type="number" name="totalCopies" placeholder="Total Copies" value={form.totalCopies} onChange={handleChange} className="border p-2 rounded" />
//           <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={handleChange} className="border p-2 rounded" required />
//           <input type="text" name="language" placeholder="Language" value={form.language} onChange={handleChange} className="border p-2 rounded" />
//           <input type="number" name="pages" placeholder="Pages" value={form.pages} onChange={handleChange} className="border p-2 rounded" />
//           <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded md:col-span-2" required />
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover</label>
//             <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
//           </div>
//           <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
//             {loading ? "Adding..." : "Add Book"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };


const AddBook = ({ setaddBook, onBookAdded }) => {
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
      let coverImageUrl = "";

      // Upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) coverImageUrl = data.url;
        else {
          toast.error("Image upload failed");
          setLoading(false);
          return;
        }
      }

      // Prepare payload
      const bookData = {
        ...form,
        price: parseFloat(form.price),
        publicationYear: parseInt(form.publicationYear),
        totalCopies: parseInt(form.totalCopies),
        availableCopies: parseInt(form.totalCopies),
        borrowedCopies: 0,
        coverImage: coverImageUrl,
      };

      const response = await bookService.createBook(bookData);

      // Show backend success message
      toast.success(response.data.message || "Book added successfully!");
      onBookAdded(response.data.data.book); // update parent list
      setaddBook(false); // close modal
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-auto">
      <div className="bg-white rounded-lg p-6 mt-10 w-full max-w-md shadow-lg relative">
        <button
          onClick={() => setaddBook(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          ×
        </button>

        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Add New Book</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="title" placeholder="Book Title" value={form.title} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="isbn" placeholder="ISBN Number" value={form.isbn} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="author" placeholder="Author" value={form.author} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} className="border p-2 rounded" />
          <input type="text" name="publisher" placeholder="Publisher" value={form.publisher} onChange={handleChange} className="border p-2 rounded" required />
          <input type="number" name="publicationYear" placeholder="Publication Year" value={form.publicationYear} onChange={handleChange} className="border p-2 rounded" required />
          <input type="number" name="totalCopies" placeholder="Total Copies" value={form.totalCopies} onChange={handleChange} className="border p-2 rounded" />
          <input type="number" name="price" placeholder="Price (₹)" value={form.price} onChange={handleChange} className="border p-2 rounded" required />
          <input type="text" name="language" placeholder="Language" value={form.language} onChange={handleChange} className="border p-2 rounded" />
          <input type="number" name="pages" placeholder="Pages" value={form.pages} onChange={handleChange} className="border p-2 rounded" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded md:col-span-2" required />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Book Cover</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
          </div>

          <button type="submit" disabled={loading} className="md:col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};


export default AddBook;
