import React, { useState, useEffect } from 'react';
import { MdAnnouncement, MdDateRange } from 'react-icons/md';
import { noticeAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const NoticesTenant = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPgId, setSelectedPgId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.pgId) {
      setSelectedPgId(user.pgId);
      fetchNotices(user.pgId);
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

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center">Loading notices...</div>
      </div>
    );
  }

  if (!selectedPgId) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Notices
          </h1>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">No PG Assigned</h2>
          <p className="text-yellow-700 dark:text-yellow-300">You need to be assigned to a PG to view notices. Please contact your PG owner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Notices
        </h1>
      </div>

      <div className="space-y-6">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <MdAnnouncement className="text-blue-500 dark:text-blue-400 text-3xl mr-4 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{notice.title}</h3>
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <MdDateRange className="text-lg mr-2" />
                      <span className="text-sm">
                        {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pl-11">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{notice.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <MdAnnouncement className="text-gray-400 dark:text-gray-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No notices available</h3>
            <p className="text-gray-500 dark:text-gray-400">Notices from your PG owner will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
