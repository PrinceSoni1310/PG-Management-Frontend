import { useEffect, useState } from 'react';
import { tenantRequestAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const TenantRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await tenantRequestAPI.ownerList();
      setRequests(res.data.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await tenantRequestAPI.updateStatus(requestId, { status });
      toast.success(`Request ${status}`);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  if (loading) {
    return <div className="text-center dark:bg-gray-900 dark:text-gray-100 min-h-screen">Loading requests...</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Tenant Requests
        </h1>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {request.tenantId?.fullName || 'Unknown Tenant'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{request.tenantId?.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    PG: {request.pgId?.pgName || 'Unknown PG'} - {request.pgId?.city}, {request.pgId?.state}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Requested on: {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                  <span className={`inline-block px-2 py-1 text-xs rounded mt-2 ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {request.status}
                  </span>
                </div>

                {request.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'approved')}
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(request._id, 'rejected')}
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No tenant requests found</p>
      )}
    </div>
  );
};