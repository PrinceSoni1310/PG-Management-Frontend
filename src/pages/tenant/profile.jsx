import React, { useState, useEffect, useRef } from 'react';
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdEdit,
  MdRoom,
  MdBusiness,
  MdDateRange,
  MdPhotoCamera,
  MdImage,
  MdLock,
  MdLocationOn,
  MdSchool,
} from 'react-icons/md';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [photoMenuOpen, setPhotoMenuOpen] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    officeAddress: '',
    collegeAddress: '',
    profilePhoto: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(sessionStorage.getItem('user'));
      if (!storedUser) throw new Error('No logged-in user');

      const profileRes = await authAPI.getProfile(storedUser._id || storedUser.id);
      const freshUser = profileRes.data || {};
      const mergedUser = { ...storedUser, ...freshUser };

      setUser(mergedUser);
      setEditForm({
        fullName: mergedUser.fullName || '',
        email: mergedUser.email || '',
        phone: mergedUser.phone || '',
        address: mergedUser.address || '',
        officeAddress: mergedUser.officeAddress || mergedUser.collegeAddress || '',
        collegeAddress: mergedUser.collegeAddress || mergedUser.officeAddress || '',
        profilePhoto: mergedUser.profilePhoto || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    if (!user) return;
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      officeAddress: user.officeAddress || user.collegeAddress || '',
      collegeAddress: user.collegeAddress || user.officeAddress || '',
      profilePhoto: user.profilePhoto || '',
    });
    setEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const payload = {
        fullName: editForm.fullName,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        officeAddress: editForm.officeAddress,
        collegeAddress: editForm.collegeAddress,
      };

      const res = await authAPI.updateUser(user._id || user.id, payload);
      const updatedUser = res.data?.data || res.data || {};
      const nextUser = { ...user, ...updatedUser };
      setUser(nextUser);
      sessionStorage.setItem('user', JSON.stringify(nextUser));
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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

    setPasswordSaving(true);
    try {
      await authAPI.changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Password change error:', error);
      const message = error.response?.data?.message || 'Failed to update password';
      toast.error(message);
    } finally {
      setPasswordSaving(false);
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Keep your tenant profile updated with address details, photo, and password.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
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
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{user.fullName || 'Tenant'}</h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Tenant'}</p>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Personal Information</h2>
                {!editing ? (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
                  >
                    <MdEdit /> Edit
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 rounded-full bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <MdPerson className="text-blue-500 text-2xl" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{user.fullName}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <MdEmail className="text-green-500 text-2xl" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    {editing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <MdPhone className="text-purple-500 text-2xl" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    {editing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{user.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <MdLocationOn className="text-indigo-500 text-2xl mt-1" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Home Address</p>
                    {editing ? (
                      <textarea
                        rows={3}
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{user.address || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                  <MdSchool className="text-yellow-500 text-2xl mt-1" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Office / College Address</p>
                    {editing ? (
                      <textarea
                        rows={3}
                        value={editForm.officeAddress}
                        onChange={(e) => setEditForm({ ...editForm, officeAddress: e.target.value })}
                        className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800 dark:text-gray-100">{user.officeAddress || user.collegeAddress || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">PG & Room Information</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quick status for your assigned PG and room.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">PG Status</p>
                <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">{user.pgId ? 'Assigned to PG' : 'Not assigned'}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Room Number</p>
                <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">{user.roomId ? `Room ${user.roomNumber || 'unknown'}` : 'Not assigned'}</p>
              </div>
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Security</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your password anytime for extra protection.</p>
              </div>
              <MdLock className="text-blue-500 text-3xl" />
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Current Password</p>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">New Password</p>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Confirm New Password</p>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSavePassword}
                className="w-full rounded-3xl bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 transition"
                disabled={passwordSaving}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Profile Photo</h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="p-6 flex justify-center">
              <img
                src={user.profilePhoto || editForm.profilePhoto}
                alt="Profile preview"
                className="max-h-[420px] w-full max-w-2xl object-contain rounded-3xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
