import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentAPI, pgAPI } from '../../services/api';
import { MdAttachMoney, MdCheckCircle, MdError, MdSend, MdCalendarToday } from 'react-icons/md';
import { toast } from 'react-toastify';

export const RentManagement = () => {
  const { auth } = useAuth();
  const [payments, setPayments] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, pgsRes] = await Promise.all([
        paymentAPI.getOwnerPayments(),
        pgAPI.getPGs()
      ]);

      console.log("Payments API response:", paymentsRes.data);
      const paymentsData = paymentsRes.data?.data || [];
      setPayments(paymentsData);
      
      const allPgs = pgsRes.data || [];
      const approvedPgs = allPgs.filter(pg => pg.status === "approved");
      setPgs(approvedPgs);

      // Restore from localStorage with validation
      if (approvedPgs.length > 0) {
        const savedPgId = localStorage.getItem('selectedPgId');
        if (savedPgId && approvedPgs.find(pg => pg._id === savedPgId)) {
          setSelectedPgId(savedPgId);
        } else if (!selectedPgId) {
          setSelectedPgId('');
        }
      }
    } catch (error) {
      toast.error('Error loading data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const safePayments = Array.isArray(payments) ? payments : [];
  const filteredPayments = safePayments.filter(p => !selectedPgId || String(p.pgId._id) === selectedPgId);

  const sendReminder = (tenantId, tenantName) => {
    setSendingReminder(prev => ({ ...prev, [tenantId]: true }));
    // TODO: Email/SMS reminder
    toast.info(`Reminder sent to ${tenantName}`);
    setTimeout(() => {
      setSendingReminder(prev => ({ ...prev, [tenantId]: false }));
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'paid':
        return <MdCheckCircle className="text-green-500" />;
      case 'pending':
        return <MdCalendarToday className="text-yellow-500" />;
      default:
        return <MdError className="text-red-500" />;
    }
  };

  if (loading) {
    return <div className="p-6 text-center dark:text-white">Loading rent data...</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          <MdAttachMoney className="inline mr-2" />
          Rent Management
        </h1>
        <select 
          value={selectedPgId} 
          onChange={(e) => {
            const newPgId = e.target.value;
            setSelectedPgId(newPgId);
            localStorage.setItem('selectedPgId', newPgId);
          }}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <option value="">All PGs</option>
          {pgs.map(pg => (
            <option key={pg._id} value={pg._id}>{pg.pgName}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">PG / Room</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          {payment.tenantId.fullName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {payment.tenantId.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.tenantId.email}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.tenantId.phone || 'No phone'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {payment.pgId.pgName} <br />
                    <span className="text-xs text-gray-500">₹{payment.pgId.rentPerBed}/bed</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-2xl font-bold text-gray-900 dark:text-gray-100">
                    ₹{payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {payment.month} {payment.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => sendReminder(payment.tenantId._id, payment.tenantId.fullName)}
                        disabled={sendingReminder[payment.tenantId._id]}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200 mr-3 flex items-center"
                      >
                        <MdSend className="mr-1" />
                        {sendingReminder[payment.tenantId._id] ? 'Sending...' : 'Reminder'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No payments found for selected PG
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Total Tenants:</span> {new Set(filteredPayments.map(p => p.tenantId._id)).size}
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Pending:</span> {filteredPayments.filter(p => p.status === 'pending').length}
          </div>
          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">Pending Amount:</span> ₹{filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0)}
          </div>
        </div>
      </div>
    </div>
  );
};
