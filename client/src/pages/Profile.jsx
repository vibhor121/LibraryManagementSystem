import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { UserIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Name is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number')
      .required('Phone number is required'),
    address: Yup.string()
      .min(10, 'Address must be at least 10 characters')
      .max(200, 'Address must be less than 200 characters')
      .required('Address is required')
  })

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const response = await authService.updateProfile(values)
        updateUser(response.data.data.user)
        toast.success('Profile updated successfully!')
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="mt-1 input-field"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                disabled
                className="mt-1 input-field bg-gray-50"
                value={user?.email || ''}
              />
              <p className="mt-1 text-sm text-gray-500">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="mt-1 input-field"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="mt-1 input-field"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.address && formik.errors.address && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.address}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Fines</dt>
              <dd className="mt-1 text-sm text-gray-900">₹{user?.totalFines || 0}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Account Status</dt>
              <dd className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Profile
