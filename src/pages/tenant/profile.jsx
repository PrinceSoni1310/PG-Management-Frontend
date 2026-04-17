import React, { useState, useEffect } from 'react';
import { MdPerson, MdEmail, MdPhone, MdEdit, MdRoom, MdBusiness, MdDateRange } from 'react-icons/md';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [pgDetails, setPgDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
        setEditForm({
          fullName: storedUser.fullName || '',
          email: storedUser.email || '',
          phone: storedUser.phone || ''
        });

        // Fetch PG details if user has pgId
        if (storedUser.pgId) {
          const pgsResponse = await authAPI.getUsers(); // This might need to be changed to a PG API call
          // For now, we'll just set basic info
          setPgDetails({ name: 'Your PG' }); // This should be fetched properly
        }

        // Fetch room details if user has roomId
        if (storedUser.roomId) {
          // This would need a room API call
          setRoomDetails({ roomNumber: storedUser.roomNumber || 'Not assigned' });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      await authAPI.updateUser(user._id || user.id, editForm);
      const freshRes = await authAPI.getProfile(user._id || user.id);
      const freshUser = { ...user, ...(freshRes.data?.data || freshRes.data || {}), ...editForm };
      setUser(freshUser);
      localStorage.setItem('user', JSON.stringify(freshUser));
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            My Profile
          </h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Profile Not Found</h2>
          <p className="text-red-700 dark:text-red-300">Unable to load user profile. Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          My Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Personal Information</h2>
            {!editing ? (
              <button
                onClick={handleEdit}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <MdEdit className="mr-2" />
                Edit
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <MdPerson className="text-blue-500 dark:text-blue-400 text-xl mr-3 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                {editing ? (
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-transparent"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{user.fullName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <MdEmail className="text-green-500 dark:text-green-400 text-xl mr-3 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                {editing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-transparent"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{user.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <MdPhone className="text-purple-500 dark:text-purple-400 text-xl mr-3 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                {editing ? (
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-transparent"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PG & Room Information */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">PG & Room Information</h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <MdBusiness className="text-indigo-500 dark:text-indigo-400 text-xl mr-3 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">PG Status</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {user.pgId ? 'Assigned to PG' : 'Not assigned to any PG'}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <MdRoom className="text-orange-500 dark:text-orange-400 text-xl mr-3 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Room Number</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {user.roomId ? `Room ${user.roomNumber || 'Unknown'}` : 'Not assigned'}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <MdDateRange className="text-teal-500 dark:text-teal-400 text-xl mr-3 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
