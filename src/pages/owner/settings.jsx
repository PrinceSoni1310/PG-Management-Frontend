import React, { useState, useEffect, useRef } from 'react';
import {
  MdPerson,
  MdPhone,
  MdLock,
  MdPhotoCamera,
  MdImage,
  MdSave,
} from 'react-icons/md';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const OwnerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    officeAddress: '',
    profilePhoto: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchOwnerProfile();
  }, []);

  const fetchOwnerProfile = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(sessionStorage.getItem('user'));
      if (!storedUser) throw new Error('No logged-in user');

      const profileRes = await authAPI.getProfile(storedUser._id || storedUser.id);
      const freshUser = profileRes.data?.data || profileRes.data || {};
      const mergedUser = { ...storedUser, ...freshUser };

      setUser(mergedUser);
      setEditForm({
        fullName: mergedUser.fullName || '',
        email: mergedUser.email || '',
        phone: mergedUser.phone || '',
        address: mergedUser.address || '',
        officeAddress: mergedUser.officeAddress || '',
        profilePhoto: mergedUser.profilePhoto || '',
      });
    } catch (error) {
      console.error('Error fetching owner profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const payload = {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        officeAddress: editForm.officeAddress,
      };

      const res = await authAPI.updateUser(user._id || user.id, payload);
      const updatedUser = res.data?.data || res.data || {};
      const nextUser = { ...user, ...updatedUser };
      setUser(nextUser);
      setEditForm({ ...editForm, profilePhoto: nextUser.profilePhoto || editForm.profilePhoto });
      sessionStorage.setItem('user', JSON.stringify(nextUser));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    }
  };

  const handlePhotoUpdate = async (file) => {
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result;
        const res = await authAPI.updateUser(user._id || user.id, { profilePhoto: base64 });
        const updatedUser = res.data?.data || res.data || {};
        const nextUser = { ...user, ...updatedUser };
        setUser(nextUser);
        setEditForm({ ...editForm, profilePhoto: nextUser.profilePhoto || editForm.profilePhoto });
        sessionStorage.setItem('user', JSON.stringify(nextUser));
        toast.success('Profile photo updated successfully');
      } catch (err) {
        console.error('Profile photo update failed:', err);
        toast.error('Failed to update profile photo');
      }
    };
    reader.onerror = (err) => {
      console.error('File read error:', err);
      toast.error('Unable to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    try {
      await authAPI.changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Password change error:', error);
      const message = error.response?.data?.message || 'Failed to update password';
      toast.error(message);
    }
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h1>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">Profile Not Found</h2>
          <p className="text-red-700 dark:text-red-300">Unable to load user profile. Please log in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your owner profile, update your photo, and secure your account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-72 flex flex-col items-center text-center rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
              <button
                type="button"
                onClick={() => setPhotoMenuOpen((prev) => !prev)}
                className="relative inline-flex items-center justify-center w-36 h-36 rounded-full overflow-hidden border-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20 focus:outline-none"
              >
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-5xl">
                    <MdPerson />
                  </div>
                )}
              </button>

              {photoMenuOpen && (
                <div className="mt-4 w-full rounded-3xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 text-left z-20">
                  <button
                    type="button"
                    onClick={() => {
                      if (!user.profilePhoto) {
                        toast.info('No profile photo uploaded yet');
                        return;
                      }
                      setShowPhotoModal(true);
                      setPhotoMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <MdImage /> View Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                  >
                    <MdPhotoCamera /> Update Photo
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  handlePhotoUpdate(file);
                  event.target.value = '';
                }}
              />

              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.fullName || 'Owner'}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Owner'}</p>
              </div>

              <div className="mt-6 text-left w-full space-y-3">
                <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
                  <p className="text-sm text-gray-800 dark:text-gray-100 break-all">{user.email}</p>
                </div>
                <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Phone</p>
                  <p className="text-sm text-gray-800 dark:text-gray-100">{user.phone || 'Not provided'}</p>
                </div>
                <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Location</p>
                  <p className="text-sm text-gray-800 dark:text-gray-100">{user.address || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MdPerson className="text-3xl text-blue-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Update Profile</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Edit your owner profile details and save changes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Office / PG Address</label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Office Contact / Address</label>
                    <input
                      type="text"
                      value={editForm.officeAddress}
                      onChange={(e) => setEditForm({ ...editForm, officeAddress: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 transition"
                  >
                    <MdSave />
                    Save Profile
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MdLock className="text-3xl text-red-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Security</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Change your password to protect your owner account.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 text-right">
                  <button
                    type="button"
                    onClick={handleSavePassword}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/10 hover:bg-red-700 transition"
                  >
                    <MdSave />
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative max-w-xl w-full rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowPhotoModal(false)}
              className="absolute right-4 top-4 rounded-full bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              ✕
            </button>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Photo</h2>
              <img src={user.profilePhoto} alt="Profile" className="mx-auto h-80 w-80 rounded-3xl object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
