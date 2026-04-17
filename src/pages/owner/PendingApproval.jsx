import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPending, MdRefresh, MdLogout } from 'react-icons/md';
import { toast } from 'react-toastify';
import { pgAPI } from '../../services/api';

export const PendingApproval = () => {
  const navigate = useNavigate();
  const [pgRequests, setPgRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPGRequests();
  }, []);

  const fetchPGRequests = async () => {
    try {
      const ownerId = localStorage.getItem('userId');
      if (!ownerId) {
        navigate('/login');
        return;
      }

      const response = await pgAPI.getOwnerPGs(ownerId);
      setPgRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching PG requests:', error);
      toast.error('Failed to load PG requests');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const checkApprovalStatus = async () => {
    try {
      const ownerId = localStorage.getItem('userId');
      const response = await pgAPI.getOwnerPGs(ownerId);
      const ownerRequests = response.data.data || [];
      const approvedPGs = ownerRequests.filter(pg => pg.status === 'approved');

      if (approvedPGs.length > 0) {
        // Set the first approved PG as selected
        localStorage.setItem('selectedPgId', approvedPGs[0]._id);
        toast.success('Your PG has been approved! Redirecting to dashboard...');
        navigate('/owner/dashboard');
      } else {
        fetchPGRequests(); // Refresh the list
        toast.info('Still waiting for approval. Please check back later.');
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
      toast.error('Failed to check approval status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MdPending className="h-8 w-8 text-yellow-500 dark:text-yellow-400 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">PG Registration Status</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MdLogout className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center mb-8">
              <MdPending className="mx-auto h-12 w-12 text-yellow-500 dark:text-yellow-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Your PG Registration is Under Review</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Our admin team is reviewing your PG registration request. You will be notified once it's approved.
              </p>
            </div>

            {/* PG Requests List */}
            {pgRequests.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Your PG Registration Requests</h4>
                <div className="space-y-4">
                  {pgRequests.map((pg) => (
                    <div key={pg._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-lg font-medium text-gray-900 dark:text-gray-100">{pg.pgName}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{pg.address}, {pg.city}, {pg.state}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Contact: {pg.contactNumber}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            pg.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : pg.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {pg.status.charAt(0).toUpperCase() + pg.status.slice(1)}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Submitted: {new Date(pg.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={checkApprovalStatus}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MdRefresh className="mr-2 h-5 w-5" />
                Check Approval Status
              </button>

              <button
                onClick={() => navigate('/owner/create-pg')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Another PG
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@pgmanagement.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                  support@pgmanagement.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};