


import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpenIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../hooks/useAuth'
// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const { user, logout } = useAuth()
//   const navigate = useNavigate()
//   const location = useLocation()

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   const isActive = (path) => location.pathname === path

//   // ✅ Separate menu items for user and admin
//   const userNavigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: BookOpenIcon },
//     { name: 'Books', href: '/books', icon: BookOpenIcon },
//     { name: 'My Books', href: '/my-books', icon: BookOpenIcon },
//     { name: 'Groups', href: '/groups', icon: BookOpenIcon },
//     { name: 'Feedback', href: '/feedback', icon: BookOpenIcon },
//   ]

//   const adminNavigation = [
//     { name: 'Admin Dashboard', href: '/admin', icon: Cog6ToothIcon },
//     { name: 'Manage Books', href: '/admin/books', icon: BookOpenIcon },
//     { name: 'Manage Users', href: '/admin/users', icon: UserIcon },
//     { name: 'Borrow Records', href: '/admin/borrows', icon: BookOpenIcon },
//     { name: 'Manage Feedback', href: '/admin/feedback', icon: BookOpenIcon },
//   ]

//   // ✅ If no user, don't render navbar
//   if (!user) return null

//   // ✅ Dynamically choose which navigation to show
//   const navItems = user.role === 'admin' ? adminNavigation : userNavigation

//   return (
//     <nav className="bg-white shadow-lg border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Left side logo and nav */}
//           <div className="flex">
//             <div className="flex-shrink-0 flex items-center">
//               <Link
//                 to={user.role === 'admin' ? '/admin' : '/dashboard'}
//                 className="text-xl font-bold text-primary-600"
//               >
//                 {user.role === 'admin'
//                   ? 'Admin Panel'
//                   : 'Library Management'}
//               </Link>
//             </div>

//             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//               {navItems.map((item) => {
//                 const Icon = item.icon
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.href}
//                     className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
//                       isActive(item.href)
//                         ? 'border-primary-500 text-gray-900'
//                         : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
//                     }`}
//                   >
//                     <Icon className="w-4 h-4 mr-2" />
//                     {item.name}
//                   </Link>
//                 )
//               })}
//             </div>
//           </div>

//           {/* Right side - profile/logout */}
//           <div className="hidden sm:ml-6 sm:flex sm:items-center">
//             <div className="ml-3 relative">
//               <div className="flex items-center space-x-4">
//                 <Link
//                   to="/profile"
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <UserIcon className="w-6 h-6" />
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <ArrowRightOnRectangleIcon className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="-mr-2 flex items-center sm:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
//             >
//               {isOpen ? (
//                 <XMarkIcon className="block h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="block h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <div className="sm:hidden">
//           <div className="pt-2 pb-3 space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon
//               return (
//                 <Link
//                   key={item.name}
//                   to={item.href}
//                   className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
//                     isActive(item.href)
//                       ? 'bg-primary-50 border-primary-500 text-primary-700'
//                       : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
//                   }`}
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <div className="flex items-center">
//                     <Icon className="w-5 h-5 mr-3" />
//                     {item.name}
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>

//           {/* ✅ Hide user profile info if admin */}
//           {user.role !== 'admin' && (
//             <div className="pt-4 pb-3 border-t border-gray-200">
//               <div className="flex items-center px-4">
//                 <div className="flex-shrink-0">
//                   <UserIcon className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <div className="ml-3">
//                   <div className="text-base font-medium text-gray-800">
//                     {user.name}
//                   </div>
//                   <div className="text-sm font-medium text-gray-500">
//                     {user.email}
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-3 space-y-1">
//                 <Link
//                   to="/profile"
//                   className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
//                   onClick={() => setIsOpen(false)}
//                 >
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
//                 >
//                   Sign out
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </nav>
//   )
// }

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BookOpenIcon },
    { name: 'Books', href: '/books', icon: BookOpenIcon },
    { name: 'My Books', href: '/my-books', icon: BookOpenIcon },
    { name: 'Groups', href: '/groups', icon: BookOpenIcon },
    { name: 'Feedback', href: '/feedback', icon: BookOpenIcon },
  ]

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: Cog6ToothIcon },
    { name: 'Manage Books', href: '/admin/books', icon: BookOpenIcon },
    { name: 'Manage Users', href: '/admin/users', icon: UserIcon },
    { name: 'Borrow Records', href: '/admin/borrows', icon: BookOpenIcon },
    { name: 'Manage Feedback', href: '/admin/feedback', icon: BookOpenIcon },
  ]

  if (!user) return null
  const navItems = user.role === 'admin' ? adminNavigation : userNavigation

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side: Logo */}
          <div className="flex items-center space-x-6">
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-2xl font-extrabold text-primary-600 hover:text-primary-500 transition duration-300"
            >
              {user.role === 'admin' ? 'Admin Panel' : 'Library Hub'}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex sm:space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 transform ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:scale-105'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side: Profile / Logout */}
          <div className="hidden sm:flex items-center space-x-3">
            {user.role !== 'admin' && (
              <Link
                to="/profile"
                className="flex items-center gap-1 px-2 py-2 rounded-full text-gray-600 hover:text-white hover:bg-primary-600 transition duration-200 transform hover:scale-105"
              >
                <UserIcon className="w-6 h-6" />
                <span className="hidden md:inline font-medium">{user.name}</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 py-2 rounded-full text-gray-600 hover:text-white hover:bg-red-500 transition duration-200 transform hover:scale-105"
            >
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
              <span className="hidden md:inline font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 text-base font-medium rounded-md transition duration-200 transform ${
                    isActive(item.href)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:scale-105'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* User Profile for mobile */}
          {user.role !== 'admin' && (
            <div className="border-t border-gray-200 mt-3 pt-3 pb-4 px-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="text-gray-800 font-medium">{user.name}</div>
                  <div className="text-gray-500 text-sm">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md transition duration-200 hover:scale-105"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md transition duration-200 hover:scale-105"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar




