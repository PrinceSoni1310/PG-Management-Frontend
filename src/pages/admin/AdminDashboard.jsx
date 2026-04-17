import { MdRoom, MdPeople, MdBusiness, MdAttachMoney } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { pgAPI, authAPI, paymentAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalOwners: 0,
    totalTenants: 0,
    totalRevenue: 0
  });
  const [pendingPGs, setPendingPGs] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [pgsRes, usersRes, paymentsRes] = await Promise.all([
        pgAPI.getPGs(),
        authAPI.getUsers(),
        paymentAPI.getAllPayments()
      ]);

      const pgs = pgsRes.data.data || [];
      const users = usersRes.data.data || [];
      const payments = paymentsRes.data.data || [];

      const owners = users.filter(u => u.role === 'Owner');
      const tenants = users.filter(u => u.role === 'Tenant');
      const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const pendingRequests = pgs.filter(pg => pg.status === 'pending');

      setStats({
        totalPGs: pgs.length,
        totalOwners: owners.length,
        totalTenants: tenants.length,
        totalRevenue: revenue
      });
      setPendingPGs(pendingRequests);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard stats');
    }
  };

  const handleApprove = async (id) => {
    try {
      await pgAPI.approvePG(id);
      toast.success('PG approved successfully');
      fetchStats();
    } catch (error) {
      toast.error('Failed to approve PG');
    }
  };

  const handleReject = async (id) => {
    try {
      await pgAPI.rejectPG(id);
      toast.success('PG rejected successfully');
      fetchStats();
    } catch (error) {
      toast.error('Failed to reject PG');
    }
  };

  const handleViewDetails = (pg) => {
    alert(`PG Details:\n\nName: ${pg.pgName}\nAddress: ${pg.address}\nCity: ${pg.city}\nState: ${pg.state}\nPincode: ${pg.pincode}\nContact: ${pg.contactNumber}\nRooms: ${pg.totalRooms}\nBeds: ${pg.totalBeds}\nRent per Bed: ₹${pg.rentPerBed}\nAmenities: ${pg.amenities?.join(', ') || 'N/A'}\nDescription: ${pg.description || 'N/A'}\n\nOwner: ${pg.ownerId?.fullName} (${pg.ownerId?.email})`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 shadow-lg p-6 rounded-xl border border-blue-200 dark:border-blue-700 text-white">
          <div className="flex items-center mb-4">
            <MdBusiness className="text-white text-3xl mr-3" />
            <h2 className="text-white font-medium">Total PGs</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalPGs}</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 shadow-lg p-6 rounded-xl border border-green-200 dark:border-green-700 text-white">
          <div className="flex items-center mb-4">
            <MdPeople className="text-white text-3xl mr-3" />
            <h2 className="text-white font-medium">Total Owners</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalOwners}</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 shadow-lg p-6 rounded-xl border border-orange-200 dark:border-orange-700 text-white">
          <div className="flex items-center mb-4">
            <MdRoom className="text-white text-3xl mr-3" />
            <h2 className="text-white font-medium">Total Tenants</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalTenants}</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 shadow-lg p-6 rounded-xl border border-red-200 dark:border-red-700 text-white">
          <div className="flex items-center mb-4">
            <MdAttachMoney className="text-white text-3xl mr-3" />
            <h2 className="text-white font-medium">Total Revenue</h2>
          </div>
          <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pending PG Requests</h2>
          <button
            onClick={() => window.location.href = '/admin/pending-requests'}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            View All Pending Requests
          </button>
        </div>

        {pendingPGs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center transition-colors duration-200">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No pending requests at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingPGs.slice(0, 5).map(pg => (
              <div key={pg._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{pg.pgName}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{pg.address}</p>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                      <p>Owner: {pg.ownerId?.fullName} ({pg.ownerId?.email})</p>
                      <p>Contact: {pg.contactNumber}</p>
                      <p>Rooms: {pg.totalRooms} | Beds: {pg.totalBeds} | Rent: ₹{pg.rentPerBed}/bed</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleApprove(pg._id)}
                      className="bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(pg._id)}
                      className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleViewDetails(pg)}
                      className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingPGs.length > 5 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => window.location.href = '/admin/pending-requests'}
                  className="bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  View All Pending Requests ({pendingPGs.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
