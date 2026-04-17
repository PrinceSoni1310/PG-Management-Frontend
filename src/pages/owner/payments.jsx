import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentAPI, pgAPI } from '../../services/api';
import { MdPayment, MdCheckCircle, MdError, MdDownload, MdFilterList } from 'react-icons/md';

export const Payments = () => {
  const { auth } = useAuth();
  const [payments, setPayments] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, pgsRes] = await Promise.all([
        paymentAPI.getOwnerPayments(),
        pgAPI.getOwnerPGs()
      ]);

      setPayments(paymentsRes.data || []);
      setPgs(pgsRes.data || []);

      if (pgsRes.data.length > 0 && !selectedPgId) {
        setSelectedPgId(pgsRes.data[0]._id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => 
    (!selectedPgId || String(p.pgId._id) === selectedPgId) &&
    (filterStatus === 'all' || p.status === filterStatus)
  );

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
        return <MdPayment className="text-yellow-500" />;
      default:
        return <MdError className="text-red-500" />;
    }
  };

  if (loading) {
    return <div className="p-6 text-center dark:text-white">Loading...</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Payment History
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={selectedPgId} 
            onChange={(e) => {
              const newPgId = e.target.value;
              setSelectedPgId(newPgId);
              localStorage.setItem('selectedPgId', newPgId);
            }}
            className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
          >
            <option value="">All PGs</option>
            {pgs.map(pg => (
              <option key={pg._id} value={pg._id}>{pg.pgName}</option>
            ))}
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Tenant</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">PG</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Method</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {payment.tenantId.fullName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.tenantId.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {payment.pgId.pgName}
                  </td>
                  <td className="px-6 py-4 font-bold text-lg text-gray-900 dark:text-gray-100">
                    ₹{payment.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {payment.paymentMethod?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No payments match the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl font-bold mb-1">{payments.filter(p => p.status === 'success').length}</div>
          <div className="opacity-90">Successful</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl font-bold mb-1">{payments.filter(p => p.status === 'pending').length}</div>
          <div className="opacity-90">Pending</div>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-red-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl font-bold mb-1">{payments.filter(p => p.status === 'failed').length}</div>
          <div className="opacity-90">Failed</div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
          <div className="text-3xl font-bold mb-1">₹{payments.reduce((sum, p) => sum + p.amount, 0)}</div>
          <div className="opacity-90">Total Collected</div>
        </div>
      </div>
    </div>
  );
};
