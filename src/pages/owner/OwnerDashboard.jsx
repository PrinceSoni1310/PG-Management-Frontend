import {
  MdRoom,
  MdPeople,
  MdCheckCircle,
  MdAttachMoney,
  MdHistory,
  MdAdd
} from 'react-icons/md';

import { useEffect, useState } from 'react';
import {
  pgAPI,
  roomAPI,
  paymentAPI,
  complaintAPI,
  noticeAPI,
  tenantRequestAPI
} from '../../services/api';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [pgs, setPgs] = useState([]);
  const [approvedPgs, setApprovedPgs] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState([]); // ✅ FIX

  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    pendingRent: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchPGs();
  }, []);

  useEffect(() => {
    if (selectedPgId) {
      fetchStats();
      fetchRecentActivities();
    }
  }, [selectedPgId]);

  // ================= FETCH PG =================
  const fetchPGs = async () => {
    try {
      const response = await pgAPI.getPGs();
      const allPgs = response.data.data || [];

      setPgs(allPgs);

      const approved = allPgs.filter(pg => pg.status === "approved");
      setApprovedPgs(approved);

      if (approved.length > 0) {
        const savedPgId = localStorage.getItem('selectedPgId');

        if (savedPgId && approved.find(pg => pg._id === savedPgId)) {
          setSelectedPgId(savedPgId);
        } else {
          setSelectedPgId(approved[0]._id);
          localStorage.setItem('selectedPgId', approved[0]._id);
        }
      }

    } catch (error) {
      console.error(error);
      toast.error('Failed to load PGs');
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH STATS =================
  const fetchStats = async () => {
    try {
      const [roomsRes, paymentsRes] = await Promise.all([
        roomAPI.getRooms(selectedPgId),
        paymentAPI.getAllPayments()
      ]);

      const rooms = roomsRes.data.data || [];
      const allPayments = paymentsRes.data.data || [];

      setPayments(allPayments); // ✅ FIX

      const totalRooms = rooms.length;
      const occupiedRooms = rooms.filter(r => r.occupants?.length > 0).length;
      const availableRooms = totalRooms - occupiedRooms;

      const pgPayments = allPayments.filter(p => String(p.pgId?._id ?? p.pgId) === selectedPgId);

      const pendingRent = pgPayments
        .filter(p => p.status === "pending")
        .reduce((sum, p) => sum + p.amount, 0);

      setStats({ totalRooms, occupiedRooms, availableRooms, pendingRent });

    } catch (error) {
      console.error(error);
      toast.error("Failed to load stats");
    }
  };

  // ================= FETCH RECENT ACTIVITY =================
  const fetchRecentActivities = async () => {
    try {
      const activities = [];

      const complaintsRes = await complaintAPI.getOwnerComplaints(selectedPgId);
      complaintsRes.data.data?.slice(0, 2).forEach(c => {
        activities.push({
          type: "complaint",
          message: `Complaint: ${c.subject}`,
          timestamp: new Date(c.createdAt)
        });
      });

      const noticesRes = await noticeAPI.getNotices(selectedPgId);
      noticesRes.data.data?.slice(0, 2).forEach(n => {
        activities.push({
          type: "notice",
          message: `Notice: ${n.title}`,
          timestamp: new Date(n.createdAt)
        });
      });

      const requestRes = await tenantRequestAPI.ownerList();
      requestRes.data.data?.slice(0, 2).forEach(r => {
        activities.push({
          type: "request",
          message: `New tenant request from ${r.tenantId?.fullName || "User"}`,
          timestamp: new Date(r.createdAt)
        });
      });

      activities.sort((a, b) => b.timestamp - a.timestamp);
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className="text-center p-6 text-white">Loading...</div>;
  }

  // ✅ SAFE CALCULATIONS
  const totalRevenue = payments
    .filter(p => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Owner Dashboard
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/owner/create-pg')}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <MdAdd /> Add PG
          </button>

          <select
            value={selectedPgId}
            onChange={(e) => {
              const newPgId = e.target.value;
              setSelectedPgId(newPgId);
              localStorage.setItem('selectedPgId', newPgId);
            }}
            className="px-4 py-2 border rounded text-white"
          >
            {approvedPgs.map(pg => (
              <option className='text-black' key={pg._id} value={pg._id}>
                {pg.pgName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-5 gap-6 mb-10">
        <Card icon={<MdRoom />} title="Total Rooms" value={stats.totalRooms} />
        <Card icon={<MdCheckCircle />} title="Occupied" value={stats.occupiedRooms} />
        <Card icon={<MdPeople />} title="Available" value={stats.availableRooms} />
        <Card icon={<MdAttachMoney />} title="Pending Rent" value={`₹${stats.pendingRent}`} />
        <Card icon={<MdAttachMoney />} title="Revenue" value={`₹${totalRevenue}`} />
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <div className="flex items-center gap-2 mb-4">
          <MdHistory />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recent Activity
          </h2>
        </div>

        {recentActivities.length === 0 ? (
          <p className="text-gray-400">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex gap-3 p-3 border rounded">
                <span>
                  {a.type === "request" && "📨"}
                  {a.type === "complaint" && "⚠️"}
                  {a.type === "notice" && "📢"}
                </span>

                <div>
                  <p className="text-gray-700 dark:text-gray-200">{a.message}</p>
                  <p className="text-xs text-gray-400">
                    {a.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

// CARD
const Card = ({ icon, title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex gap-4 items-center">
    <div className="text-3xl text-blue-500">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{value}</h2>
    </div>
  </div>
);