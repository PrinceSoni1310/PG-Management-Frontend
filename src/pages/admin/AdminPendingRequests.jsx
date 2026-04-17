import { useEffect, useState } from 'react';
import { pgAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const AdminPendingRequests = () => {
  const [pendingPGs, setPendingPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPGs();
  }, []);

  const fetchPendingPGs = async () => {
    try {
      setLoading(true);
      const res = await pgAPI.adminGetAllPGs(null, 'pending');
      const pgs = res.data.data || [];
      setPendingPGs(pgs.filter(pg => pg.status === 'pending'));
    } catch (error) {
      console.error('Error fetching pending PGs:', error);
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      console.log('Approving PG with ID:', id);
      const response = await pgAPI.approvePG(id);
      console.log('Approval response:', response);
      toast.success('PG approved successfully');
      // Immediately remove the approved PG from the local state
      setPendingPGs(prevPGs => prevPGs.filter(pg => pg._id !== id));
      // Don't refetch immediately to avoid overriding the local state change
    } catch (error) {
      console.error('Error approving PG:', error);
      console.error('Error response:', error.response);
      toast.error(`Failed to approve PG: ${error.response?.data?.message || error.message}`);
      // Refetch on error to ensure consistency
      fetchPendingPGs();
    }
  };

  const handleReject = async (id) => {
    try {
      console.log('Rejecting PG with ID:', id);
      const response = await pgAPI.rejectPG(id);
      console.log('Reject response:', response);
      toast.success('PG rejected successfully');
      // Immediately remove the rejected PG from the local state
      setPendingPGs(prevPGs => prevPGs.filter(pg => pg._id !== id));
      // Don't refetch immediately to avoid overriding the local state change
    } catch (error) {
      console.error('Error rejecting PG:', error);
      console.error('Error response:', error.response);
      toast.error(`Failed to reject PG: ${error.response?.data?.message || error.message}`);
      // Refetch on error to ensure consistency
      fetchPendingPGs();
    }
  };

  const handleViewDetails = (pg) => {
    alert(`PG Details:\n\nName: ${pg.pgName}\nAddress: ${pg.address}\nCity: ${pg.city}\nState: ${pg.state}\nPincode: ${pg.pincode}\nContact: ${pg.contactNumber}\nRooms: ${pg.totalRooms}\nBeds: ${pg.totalBeds}\nRent per Bed: ₹${pg.rentPerBed}\nAmenities: ${pg.amenities?.join(', ') || 'N/A'}\nDescription: ${pg.description || 'N/A'}\n\nOwner: ${pg.ownerId?.fullName} (${pg.ownerId?.email})`);
  };

  if (loading) {
    return <div className="p-6 text-center dark:text-gray-200">Loading...</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Pending PG Requests</h1>
      </div>

      {pendingPGs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No pending requests at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingPGs.map(pg => (
            <div key={pg._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-700">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{pg.pgName}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{pg.address}</p>
                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 grid grid-cols-2 gap-2">
                    <p><strong className="dark:text-gray-300">City:</strong> {pg.city}</p>
                    <p><strong className="dark:text-gray-300">State:</strong> {pg.state}</p>
                    <p><strong className="dark:text-gray-300">Owner:</strong> {pg.ownerId?.fullName}</p>
                    <p><strong className="dark:text-gray-300">Contact:</strong> {pg.contactNumber}</p>
                    <p><strong className="dark:text-gray-300">Rooms:</strong> {pg.totalRooms}</p>
                    <p><strong className="dark:text-gray-300">Beds:</strong> {pg.totalBeds}</p>
                    <p><strong className="dark:text-gray-300">Rent per Bed:</strong> ₹{pg.rentPerBed}</p>
                    <p><strong className="dark:text-gray-300">Status:</strong> <span className="text-orange-600 dark:text-orange-400 font-semibold">Pending</span></p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(pg._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition duration-200 whitespace-nowrap"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(pg._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition duration-200 whitespace-nowrap"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleViewDetails(pg)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-200 whitespace-nowrap"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
