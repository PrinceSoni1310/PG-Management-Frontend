import { MdRoom, MdAttachMoney, MdPayment, MdPeople, MdRestaurant, MdAnnouncement, MdReport, MdPerson } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { authAPI, roomAPI, paymentAPI, foodAPI, noticeAPI, complaintAPI, pgAPI, tenantRequestAPI } from '../../services/api';

import { toast } from 'react-toastify';

export const TenantDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    roomNumber: '',
    monthlyRent: 0,
    paymentStatus: 'pending',
    roomPartners: [],
    foodMenu: [],
    notices: [],
    complaints: []
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [pgList, setPgList] = useState([]);
  const [selectedPg, setSelectedPg] = useState('');
  const [requestStatus, setRequestStatus] = useState(null); // 'pending', 'approved', 'declined'
  const [userRequests, setUserRequests] = useState([]);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      let storedUser;
      try {
        const userString = localStorage.getItem('user');
        storedUser = userString ? JSON.parse(userString) : null;
      } catch (parseError) {
        console.error('Error parsing user from localStorage:', parseError);
        storedUser = null;
      }

      if (!storedUser || (!storedUser.id && !storedUser._id)) {
        console.warn('No valid user found in localStorage');
        setLoading(false);
        return;
      }

      // normalize id
      if (!storedUser.id && storedUser._id) storedUser = { ...storedUser, id: storedUser._id };
      if (!storedUser._id && storedUser.id) storedUser = { ...storedUser, _id: storedUser.id };

      // Refresh user data from backend
      try {
        const profileRes = await authAPI.getProfile(storedUser.id);
        const freshUser = profileRes.data?.data || profileRes.data || {};
        storedUser = { ...storedUser, ...freshUser, id: freshUser._id || storedUser.id };
        localStorage.setItem('user', JSON.stringify(storedUser));
        if (storedUser.pgId) localStorage.setItem('pgId', storedUser.pgId);
      } catch (refreshError) {
        console.warn('Could not refresh user profile:', refreshError);
      }

      setUser(storedUser);

      if (storedUser.pgId) {
        // User has PG assigned, load dashboard
        await fetchDashboardData(storedUser);
      } else {
        // No PG assigned, load PG list and check requests
        await fetchPgList();
        await fetchTenantRequests(storedUser.id);
      }
    } catch (error) {
      console.error('Error initializing dashboard:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchDashboardData = async (userData) => {
    try {
      if (!userData.roomId) {
        // Has PG but no room, show limited dashboard
        await fetchLimitedDashboardData(userData);
        return;
      }

      // Fetch room details - find room containing this user in occupants
      let rooms = [];
      let userRoom = null;
      try {
        const roomRes = await roomAPI.getRooms(userData.pgId);
        rooms = roomRes.data.data || [];
        for (const room of rooms) {
          if (room.occupants && room.occupants.some(occ => String(occ._id) === String(userData.id))) {
            userRoom = room;
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }

      if (!userRoom) {
        await fetchLimitedDashboardData(userData);
        return;
      }


      // Fetch payment status
      let paymentStatus = 'pending';
      try {
        const paymentRes = await paymentAPI.getPayments(userData.id);
        const payments = paymentRes.data.data || [];
        const latestPayment = payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        paymentStatus = latestPayment ? latestPayment.status : 'pending';
      } catch (error) {
        console.error('Error fetching payments:', error);
      }

      // Get room partners (other tenants in same room)
      let roomPartners = [];
      if (userRoom.occupants && Array.isArray(userRoom.occupants)) {
        roomPartners = userRoom.occupants.filter(occupant => {
          // Handle both object and ID formats
          const occupantId = typeof occupant === 'object' ? occupant._id : occupant;
          return String(occupantId) !== String(userData.id);
        }).map(occupant => {
          // If it's an ID string, we can't display partner details, so return a basic object
          if (typeof occupant === 'string') {
            return { _id: occupant, fullName: 'Roommate', email: 'N/A' };
          }
          return occupant;
        });
      }

      // Fetch and process today's food menu
      let todaysMenu = null;
      try {
        const foodRes = await foodAPI.getFood(userData.pgId);
        const allMenus = foodRes.data.data || [];
        todaysMenu = getTodaysMenu(allMenus);
      } catch (error) {
        console.error('Error fetching food menu:', error);
      }


      // Fetch notices
      let notices = [];
      try {
        const noticeRes = await noticeAPI.getNotices(userData.pgId);
        notices = noticeRes.data.data || [];
      } catch (error) {
        console.error('Error fetching notices:', error);
      }

      // Fetch user's complaints
      let complaints = [];
      try {
        const complaintRes = await complaintAPI.getTenantComplaints();
        complaints = complaintRes.data.data || [];
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }

      setDashboardData({
        roomNumber: userRoom.roomNumber,
        monthlyRent: userRoom.rentAmount || 0,
        paymentStatus,
        roomPartners,
        todaysMenu,
        notices: notices.slice(0, 3),
        complaints: complaints.slice(0, 3)
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchLimitedDashboardData = async (userData) => {
    try {
      // Fetch and process today's food menu
      let todaysMenu = null;
      try {
        const foodRes = await foodAPI.getFood(userData.pgId);
        const allMenus = foodRes.data.data || [];
        todaysMenu = getTodaysMenu(allMenus);
      } catch (error) {
        console.error('Error fetching food menu:', error);
      }

      // Fetch notices
      let notices = [];
      try {
        const noticeRes = await noticeAPI.getNotices(userData.pgId);
        notices = noticeRes.data.data || [];
      } catch (error) {
        console.error('Error fetching notices:', error);
      }


      // Fetch user's complaints
      let complaints = [];
      try {
        const complaintRes = await complaintAPI.getTenantComplaints();
        complaints = complaintRes.data.data || [];
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }

      setDashboardData({
        roomNumber: 'Not Assigned',
        monthlyRent: 0,
        paymentStatus: 'N/A',
        roomPartners: [],
        todaysMenu: null,
        notices: notices.slice(0, 3),
        complaints: complaints.slice(0, 3)
      });
    } catch (error) {
      console.error('Error fetching limited dashboard data:', error);
      toast.error('Failed to load dashboard data');
    }
  };


  const fetchPgList = async () => {
    try {
      const res = await pgAPI.getPGs();
      // setPgList(res.data.data || []);
      console.log("PG RESPONSE:", res.data); // 👈 CHECK THIS
      setPgList(res.data.data || res.data || []);
    } catch (error) {
      console.error('Error fetching PG list:', error);
      setPgList([]);
    }
  };

  const fetchTenantRequests = async (tenantId) => {
    try {
      const res = await tenantRequestAPI.tenantList();
      const requests = res.data.data || [];
      setUserRequests(requests);

      // Determine request status
      const pendingRequest = requests.find(request => request.status === 'pending');
      if (pendingRequest) {
        setRequestStatus('pending');
      } else if (requests.length > 0) {
        const latestRequest = requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setRequestStatus(latestRequest.status);
      }
    } catch (error) {
      console.error('Error fetching tenant requests:', error);
    }
  };

  const sendJoinRequest = async () => {
    if (!selectedPg) {
      toast.error('Please select a PG');
      return;
    }

    try {
      const res = await tenantRequestAPI.create({
        pgId: selectedPg,
        message: 'Request to join PG'
      });
      toast.success('Join request sent successfully');
      setRequestStatus('pending');
      // Refresh requests
      await fetchTenantRequests(user.id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send join request';
      console.error('Error sending join request:', error.response?.data || error);
      toast.error(`Failed to send join request: ${errorMessage}`);
    }
  };

  const getTodaysMenu = (allMenus) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = DAYS[today.getDay()];

    const isActive = (menu) => {
      const start = new Date(menu.startDate);
      const end = new Date(menu.endDate);
      return today >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
             today <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    };

    // Weekly — find today's day entry
    const weeklyMenu = allMenus.find(m => m.menuType === 'weekly' && isActive(m));
    if (weeklyMenu) {
      return weeklyMenu.weeklyMenu?.find(d => d.day === todayName) || null;
    }

    // Monthly — find correct week by day-of-month, then today's day
    const monthlyMenu = allMenus.find(m => m.menuType === 'monthly' && isActive(m));
    if (monthlyMenu) {
      const weekIndex = Math.min(Math.floor((today.getDate() - 1) / 7), 3);
      return monthlyMenu.monthlyMenu?.[weekIndex]?.weeklyMenu?.find(d => d.day === todayName) || null;
    }

    return null;
  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>Unable to load user information. Please log in again.</p>
        </div>
      </div>
    );
  }

  if (user && user.pgId) {
    // Show full dashboard
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Tenant Dashboard
          </h1>
        </div>

        {!user.roomId && (
          <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 mb-6 rounded">
            <p>Room assignment required. Please contact your PG owner for room assignment.</p>
          </div>
        )}

        {/* MAIN DASHBOARD CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 shadow-lg p-6 rounded-xl border border-blue-200 dark:border-blue-700 text-white">
            <div className="flex items-center mb-4">
              <MdRoom className="text-white text-3xl mr-3" />
              <h2 className="text-white font-medium">Room Number</h2>
            </div>
            <p className="text-3xl font-bold">{dashboardData.roomNumber || 'Not Assigned'}</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 shadow-lg p-6 rounded-xl border border-green-200 dark:border-green-700 text-white">
            <div className="flex items-center mb-4">
              <MdAttachMoney className="text-white text-3xl mr-3" />
              <h2 className="text-white font-medium">Monthly Rent</h2>
            </div>
            <p className="text-3xl font-bold">₹{dashboardData.monthlyRent}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 shadow-lg p-6 rounded-xl border border-purple-200 dark:border-purple-700 text-white">
            <div className="flex items-center mb-4">
              <MdPayment className="text-white text-3xl mr-3" />
              <h2 className="text-white font-medium">Payment Status</h2>
            </div>
            <p className={`text-3xl font-bold ${dashboardData.paymentStatus === 'paid' ? 'text-green-200' : 'text-red-200'}`}>
              {dashboardData.paymentStatus}
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 shadow-lg p-6 rounded-xl border border-orange-200 dark:border-orange-700 text-white">
            <div className="flex items-center mb-4">
              <MdPeople className="text-white text-3xl mr-3" />
              <h2 className="text-white font-medium">Room Partners</h2>
            </div>
            <p className="text-3xl font-bold">{dashboardData.roomPartners.length}</p>
          </div>
        </div>

        {/* ADDITIONAL SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FOOD MENU */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center mb-4">
              <MdRestaurant className="text-green-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Today's Food Menu</h2>
            </div>
            {dashboardData.todaysMenu ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">Breakfast</h4>
                  <p className="text-gray-700 dark:text-gray-200">{dashboardData.todaysMenu.breakfast || 'N/A'}</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">Lunch</h4>
                  <p className="text-gray-700 dark:text-gray-200">{dashboardData.todaysMenu.lunch || 'N/A'}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Dinner</h4>
                  <p className="text-gray-700 dark:text-gray-200">{dashboardData.todaysMenu.dinner || 'N/A'}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No food menu available for today</p>
            )}
          </div>


          {/* NOTICES */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center mb-4">
              <MdAnnouncement className="text-blue-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Notices</h2>
            </div>
            {dashboardData.notices.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.notices.map((notice, index) => (
                  <div key={index} className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-medium text-gray-800 dark:text-gray-100">{notice.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notice.content}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No notices available</p>
            )}
          </div>

          {/* ROOM PARTNERS */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center mb-4">
              <MdPeople className="text-purple-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Room Partners</h2>
            </div>
            {dashboardData.roomPartners.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.roomPartners.map((partner, index) => (
                  <div key={index} className="flex items-center p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <MdPerson className="text-purple-500 text-xl mr-3" />
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{partner.fullName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{partner.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No room partners</p>
            )}
          </div>

          {/* MY COMPLAINTS */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center mb-4">
              <MdReport className="text-red-500 text-2xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">My Complaints</h2>
            </div>
            {dashboardData.complaints.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.complaints.map((complaint, index) => (
                  <div key={index} className="p-3 bg-red-50 dark:bg-red-900 rounded-lg border-l-4 border-red-500">
                    <h3 className="font-medium text-gray-800 dark:text-gray-100">{complaint.subject}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{complaint.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        complaint.status === 'resolved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                        complaint.status === 'in-progress' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {complaint.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No complaints submitted</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No PG assigned, show PG selection
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Join a PG
        </h1>
      </div>

      {requestStatus === 'declined' && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded">
          <p>Your request has been declined. Please select another PG.</p>
        </div>
      )}

      {requestStatus === 'pending' && (
        <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 mb-6 rounded">
          <p>Your join request is pending approval from the PG owner.</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Available PGs</h2>
        {pgList.length > 0 ? (
          <div className="space-y-4">
            {pgList.map((pg) => (
              <div
                key={pg._id}
                onClick={() => requestStatus !== 'pending' && setSelectedPg(pg._id)}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedPg === pg._id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400' 
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-100">{pg.pgName || pg.name || 'Unnamed PG'}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pg.address || 'Address not available'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Owner: {pg.ownerId?.fullName || pg.owner?.fullName || 'Not available'}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="selectedPg"
                      value={pg._id}
                      checked={selectedPg === pg._id}
                      onChange={(e) => setSelectedPg(e.target.value)}
                      disabled={requestStatus === 'pending'}
                    />
                    <label className="text-sm text-gray-700 dark:text-gray-300">Select</label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No PGs available</p>
        )}

        {pgList.length > 0 && requestStatus !== 'pending' && (
          <div className="mt-6">
            <button
              onClick={sendJoinRequest}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Send Join Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
};