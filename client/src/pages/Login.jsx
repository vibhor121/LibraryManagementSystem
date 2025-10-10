import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../hooks/useAuth'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const { login, loading } = useAuth()
//   const navigate = useNavigate()

//   const validationSchema = Yup.object({
//     email: Yup.string()
//       .email('Invalid email address')
//       .required('Email is required'),
//     password: Yup.string()
//       .min(6, 'Password must be at least 6 characters')
//       .required('Password is required')
//   })

//   const formik = useFormik({
//     initialValues: {
//       email: '',
//       password: ''
//     },
//     validationSchema,
//     onSubmit: async (values) => {
//       const result = await login(values.email, values.password)
//       if (result.success) {
//         toast.success('Login successful!')
//         navigate('/dashboard')
//       } else {
//         toast.error(result.error)
//       }
//     }
//   })

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//           <div className="text-center">
//             <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
//               <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//               </svg>
//             </div>
//             <h2 className="mt-6 text-3xl font-bold text-gray-900">
//               Welcome Back
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Sign in to your Library Management account
//             </p>
//           </div>
          
//           <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
//                   placeholder="Enter your email"
//                   value={formik.values.email}
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                 />
//                 {formik.touched.email && formik.errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
//                 )}
//               </div>
              
//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     autoComplete="current-password"
//                     required
//                     className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out"
//                     placeholder="Enter your password"
//                     value={formik.values.password}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                   </button>
//                 </div>
//                 {formik.touched.password && formik.errors.password && (
//                   <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
//                 )}
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out"
//               >
//                 {loading ? (
//                   <div className="flex items-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Signing in...
//                   </div>
//                 ) : (
//                   'Sign In'
//                 )}
//               </button>
//             </div>
//           </form>
          
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Don't have an account?{' '}
//               <Link
//                 to="/register"
//                 className="font-medium text-blue-600 hover:text-blue-500 transition duration-200 ease-in-out"
//               >
//                 Create one here
//               </Link>
//             </p>
//           </div>
          
//           <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//             <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Admin Credentials:</h3>
//             <p className="text-xs text-blue-700">
//               Email: <span className="font-mono">admin@library.com</span><br/>
//               Password: <span className="font-mono">admin123</span>
//             </p>
//             <p className="text-xs text-blue-600 mt-1">
//               (Create admin account first using the API endpoint)
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      const result = await login(values.email, values.password);
      if (result.success) {
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(result.error);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-200">
        
        {/* Logo & Heading */}
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your Library Management account</p>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-500 transition duration-200">
            Create one
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 bg-indigo-50 p-4 rounded-xl border-l-4 border-indigo-400">
          <h3 className="text-sm font-semibold text-indigo-800">Demo Admin Credentials:</h3>
          <p className="text-xs text-indigo-700 mt-1">
            Email: <span className="font-mono">admin@library.com</span><br/>
            Password: <span className="font-mono">admin123</span>
          </p>
          <p className="text-xs text-indigo-600 mt-1">(Create admin account first using the API)</p>
        </div>

      </div>
    </div>
  );
};


export default Login
