import React, { useState, useEffect } from 'react';
import { MdReport, MdSend, MdCheckCircle, MdError, MdDateRange } from 'react-icons/md';
import { complaintAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const ComplaintsTenant = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ subject: '', description: '', category: 'General' });
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchComplaints();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getTenantComplaints();
      setComplaints(response.data.data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!user || !user.pgId) {
      toast.error('You must be assigned to a PG to submit complaints');
      return;
    }

    try {
      setSubmitting(true);
      const complaintData = {
        category: formData.subject,
        description: formData.description,
        pgId: user.pgId
      };

      await complaintAPI.createComplaint(complaintData);
      toast.success('Complaint submitted successfully');
      setFormData({ subject: '', description: '', category: 'General' });
      fetchComplaints();
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <MdError className="mr-1" />;
      case 'in-progress':
        return <MdReport className="mr-1" />;
      case 'resolved':
        return <MdCheckCircle className="mr-1" />;
      default:
        return <MdReport className="mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Complaints
        </h1>
      </div>

      {/* Complaint Form */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Submit New Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-transparent"
              placeholder="Brief title of your complaint"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {['General', 'Plumbing', 'Electrical', 'Food', 'Cleaning', 'Security', 'Other'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-2 font-medium">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-transparent h-32 resize-none"
              placeholder="Describe your complaint in detail"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:bg-blue-300 dark:disabled:bg-blue-400 flex items-center transition-colors"
          >
            <MdSend className="mr-2" />
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      {/* Complaints List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Your Complaints ({complaints.length})</h2>
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <MdReport className="text-red-500 dark:text-red-400 text-3xl mr-4 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{complaint.subject}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <MdDateRange className="mr-1" />
                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pl-11">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-3">{complaint.description}</p>
                {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(complaint.updatedAt).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <MdReport className="text-gray-400 dark:text-gray-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No complaints submitted</h3>
            <p className="text-gray-500 dark:text-gray-400">Your submitted complaints will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
