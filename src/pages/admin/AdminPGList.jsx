import { useEffect, useState } from 'react';
import { pgAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { MdCheck, MdClose, MdDelete, MdBusiness, MdLocationOn, MdMeetingRoom, MdPerson } from 'react-icons/md';

export const AdminPGList = () => {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      setLoading(true);
      const res = await pgAPI.getPGs();
      // setPGs(res.data.data || []);
      setPGs(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error('Error fetching PGs:', error);
      toast.error('Failed to load PGs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await pgAPI.approvePG(id);
      toast.success('PG approved successfully');
      fetchPGs();
    } catch (error) {
      console.error('Error approving PG:', error);
      toast.error('Failed to approve PG');
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Are you sure you want to reject this PG?')) {
      try {
        await pgAPI.rejectPG(id);
        toast.success('PG rejected successfully');
        fetchPGs();
      } catch (error) {
        console.error('Error rejecting PG:', error);
        toast.error('Failed to reject PG');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this PG?')) {
      try {
        await pgAPI.deletePG(id);
        toast.success('PG deleted successfully');
        fetchPGs();
      } catch (error) {
        toast.error('Failed to delete PG');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center dark:text-gray-200">Loading PGs...</div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">PG Management</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total PGs: {pgs.length} |
            Pending: {pgs.filter(pg => pg.status === 'pending').length} |
            Approved: {pgs.filter(pg => pg.status === 'approved').length}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {pgs.length > 0 ? (
          pgs.map(pg => (
            <div key={pg._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl dark:hover:shadow-gray-600 transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <MdBusiness className="text-blue-500 dark:text-blue-400 text-3xl mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{pg.pgName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <MdPerson className="mr-2 text-green-500 dark:text-green-400" />
                        Owner: {pg.ownerId?.fullName || 'N/A'}
                      </div>
                      <div className="flex items-center">
                        <MdLocationOn className="mr-2 text-red-500 dark:text-red-400" />
                        {pg.city}, {pg.state}
                      </div>
                      <div className="flex items-center">
                        <MdMeetingRoom className="mr-2 text-purple-500 dark:text-purple-400" />
                        {pg.totalRooms} rooms, {pg.totalBeds} beds
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 ml-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(pg.status)}`}>
                    {pg.status?.charAt(0).toUpperCase() + pg.status?.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    {pg.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(pg._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 flex items-center transition-colors"
                          title="Approve PG"
                        >
                          <MdCheck className="mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(pg._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 flex items-center transition-colors"
                          title="Reject PG"
                        >
                          <MdClose className="mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(pg._id)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 flex items-center transition-colors"
                      title="Delete PG"
                    >
                      <MdDelete className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="pl-11">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{pg.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Rent per bed: ₹{pg.rentPerBed}/month</span>
                  <span>Contact: {pg.contactNumber}</span>
                </div>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Created: {new Date(pg.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <MdBusiness className="text-gray-400 dark:text-gray-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No PGs found</h3>
            <p className="text-gray-500 dark:text-gray-400">PG registration requests will appear here for approval.</p>
          </div>
        )}
      </div>
    </div>
  );
};
