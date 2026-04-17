import React, { useState, useEffect } from 'react';
import { MdReport, MdCheckCircle, MdError, MdPerson, MdRoom, MdDateRange } from 'react-icons/md';
import { complaintAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const ComplaintsOwner = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPgId, setSelectedPgId] = useState('');

  useEffect(() => {
    const pgId = localStorage.getItem('selectedPgId');
    if (pgId) {
      setSelectedPgId(pgId);
      fetchComplaints(pgId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchComplaints = async (pgId) => {
    try {
      setLoading(true);
      const response = await complaintAPI.getOwnerComplaints(pgId);
      setComplaints(response.data.data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      await complaintAPI.updateComplaintStatus(complaintId, { status: newStatus });
      toast.success(`Complaint ${newStatus === 'resolved' ? 'resolved' : 'marked as in progress'}`);
      fetchComplaints(selectedPgId);
    } catch (error) {
      console.error('Error updating complaint:', error);
      toast.error('Failed to update complaint status');
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
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
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
        <div className="text-center dark:text-gray-200">Loading complaints...</div>
      </div>
    );
  }

  if (!selectedPgId) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">No PG Selected</h2>
          <p className="text-yellow-700 dark:text-yellow-300">Please select a PG from your dashboard to view complaints.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Complaints Management
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Complaints: {complaints.length}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-gray-600 transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <MdReport className="text-red-500 dark:text-red-400 text-3xl mr-4 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{complaint.subject}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <MdPerson className="mr-1" />
                        {complaint.tenantId?.fullName || 'Unknown Tenant'}
                      </div>
                      <div className="flex items-center">
                        <MdRoom className="mr-1" />
                        Room {complaint.roomNumber || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <MdDateRange className="mr-1" />
                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(complaint.status)}`}>
                    {getStatusIcon(complaint.status)}
                    {complaint.status}
                  </span>
                  <div className="flex space-x-2">
                    {complaint.status !== 'resolved' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint._id, complaint.status === 'pending' ? 'in-progress' : 'resolved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          complaint.status === 'pending'
                            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                            : 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                        }`}
                      >
                        {complaint.status === 'pending' ? 'Start Working' : 'Mark Resolved'}
                      </button>
                    )}
                    {complaint.status === 'resolved' && (
                      <button
                        onClick={() => updateComplaintStatus(complaint._id, 'pending')}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
                      >
                        Reopen
                      </button>
                    )}
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
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No complaints received</h3>
            <p className="text-gray-500 dark:text-gray-400">Complaints from tenants will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
