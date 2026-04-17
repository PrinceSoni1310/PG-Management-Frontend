import React, { useState, useEffect } from 'react';
import { MdAnnouncement, MdSend, MdDateRange, MdDelete } from 'react-icons/md';
import { noticeAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const NoticesOwner = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedPgId, setSelectedPgId] = useState('');

  useEffect(() => {
    const pgId = localStorage.getItem('selectedPgId');
    if (pgId) {
      setSelectedPgId(pgId);
      fetchNotices(pgId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNotices = async (pgId) => {
    try {
      setLoading(true);
      const response = await noticeAPI.getNotices(pgId);
      setNotices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!selectedPgId) {
      toast.error('No PG selected');
      return;
    }

    try {
      setSubmitting(true);
      const noticeData = {
        ...formData,
        pgId: selectedPgId
      };

      await noticeAPI.createNotice(noticeData);
      toast.success('Notice posted successfully');
      setFormData({ title: '', content: '' });
      fetchNotices(selectedPgId);
    } catch (error) {
      console.error('Error creating notice:', error);
      toast.error('Failed to post notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    try {
      await noticeAPI.deleteNotice(noticeId);
      toast.success('Notice deleted successfully');
      fetchNotices(selectedPgId);
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center dark:text-gray-200">Loading notices...</div>
      </div>
    );
  }

  if (!selectedPgId) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">No PG Selected</h2>
          <p className="text-yellow-700 dark:text-yellow-300">Please select a PG from your dashboard to manage notices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Notices Management
        </h1>
      </div>

      {/* Notice Form */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Create New Notice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter notice title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter notice content"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 flex items-center transition-colors"
          >
            <MdSend className="mr-2" />
            {submitting ? 'Posting...' : 'Post Notice'}
          </button>
        </form>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Posted Notices ({notices.length})</h2>
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-gray-600 transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <MdAnnouncement className="text-blue-500 dark:text-blue-400 text-3xl mr-4 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{notice.title}</h3>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                      <MdDateRange className="text-lg mr-2" />
                      <span className="text-sm">
                        {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(notice._id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                  title="Delete Notice"
                >
                  <MdDelete className="text-xl" />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base pl-11">{notice.content}</p>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <MdAnnouncement className="text-gray-400 dark:text-gray-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No notices posted yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Create your first notice using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
};
