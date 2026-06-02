import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { paymentAPI, pgAPI, authAPI } from '../../services/api';
import { MdAttachMoney, MdCheckCircle, MdError, MdSend, MdCalendarToday, MdCopyAll } from 'react-icons/md';
import { toast } from 'react-toastify';
import { UPIQRCode } from '../../components/UPIQRCode';

export const RentManagement = () => {
  const { auth } = useAuth();
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [selectedPgId, setSelectedPgId] = useState('');
  const [selectedPg, setSelectedPg] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState({});
  const [savingUpi, setSavingUpi] = useState(false);
  const [recentlyMarkedPaid, setRecentlyMarkedPaid] = useState({});
  const [undoing, setUndoing] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const pg = pgs.find((item) => item._id === selectedPgId);
    setSelectedPg(pg || null);
    setUpiId(pg?.upiId || '');
  }, [pgs, selectedPgId]);

  const fetchData = async () => {
    try {
      setError('');
      const [paymentsRes, pgsRes, usersRes] = await Promise.all([
        paymentAPI.getOwnerPayments(),
        pgAPI.getPGs(),
        authAPI.getUsers(),
      ]);

      const paymentsData = paymentsRes.data?.data || [];
      setPayments(paymentsData);

      const usersData = usersRes.data?.data || [];
      setUsers(usersData);

      const allPgs = Array.isArray(pgsRes.data?.data)
        ? pgsRes.data.data
        : Array.isArray(pgsRes.data)
        ? pgsRes.data
        : [];

      const approvedPgs = allPgs.filter((pg) => pg.status === 'approved');
      setPgs(approvedPgs);

      if (approvedPgs.length > 0) {
        const savedPgId = sessionStorage.getItem('selectedPgId');
        const validId = savedPgId && approvedPgs.find((pg) => pg._id === savedPgId) ? savedPgId : approvedPgs[0]._id;
        setSelectedPgId(validId);
      }
    } catch (error) {
      setError('Error loading rent data');
      toast.error('Error loading rent data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const undoMarkPaid = async (paymentId) => {
    try {
      setUndoing((s) => ({ ...s, [paymentId]: true }));
      await paymentAPI.unmarkPaymentPaid(paymentId);
      toast.success('Payment reverted to pending');
      // disable undo in UI for this payment
      setRecentlyMarkedPaid((prev) => ({ ...prev, [paymentId]: false }));
      await fetchData();
    } catch (err) {
      toast.error('Unable to undo payment');
      console.error(err);
    } finally {
      setUndoing((s) => ({ ...s, [paymentId]: false }));
    }
  };

  const safePayments = Array.isArray(payments) ? payments : [];
  const safeUsers = Array.isArray(users) ? users : [];
  const filteredPayments = safePayments.filter((p) => {
    if (!selectedPgId) return true;
    const pgIdVal = p.pgId?._id || p.pgId;
    return String(pgIdVal) === selectedPgId;
  });

  const paidPayments = filteredPayments.filter((p) => p.status === 'success');

  // only pending DB payments (existing) for display
  const existingPending = filteredPayments.filter((p) => p.status === 'pending');

  // synthesize tenants without a paid record for current month/year
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();

  const tenantsForPg = safeUsers.filter((u) => {
    if ((u.role || '').toLowerCase() !== 'tenant') return false;
    const uPg = u.pgId?._id || u.pgId;
    return selectedPgId ? String(uPg) === selectedPgId : true;
  });

  const syntheticPending = tenantsForPg
    .filter((t) => {
      return !filteredPayments.some((pay) => {
        const tenantIdVal = pay.tenantId?._id || pay.tenantId;
        const sameTenant = String(tenantIdVal) === String(t._id);
        const payMonth = (pay.month || '').toString();
        const sameMonth = payMonth === currentMonthName || Number(payMonth) === (now.getMonth() + 1);
        const sameYear = Number(pay.year) === currentYear;
        return sameTenant && sameMonth && sameYear;
      });
    })
    .map((t) => ({
      _id: `pending-synthetic-${t._id}`,
      tenantId: t,
      pgId: selectedPg || (t.pgId || null),
      ownerId: selectedPg?.ownerId || null,
      amount: selectedPg?.rentPerBed || t.rentAmount || 0,
      month: currentMonthName,
      year: currentYear,
      status: 'pending',
      paymentMethod: 'cash',
      synthetic: true,
    }));

  const pendingPayments = [...existingPending, ...syntheticPending];

  const sendReminder = (tenantId, tenantName) => {
    setSendingReminder((prev) => ({ ...prev, [tenantId]: true }));
    toast.info(`Reminder sent to ${tenantName}`);
    setTimeout(() => {
      setSendingReminder((prev) => ({ ...prev, [tenantId]: false }));
    }, 2000);
  };

  const saveUpiId = async () => {
    if (!selectedPgId) {
      toast.error('Choose a PG first');
      return;
    }

    try {
      setSavingUpi(true);
      await pgAPI.updatePG(selectedPgId, { upiId: upiId.trim() });
      toast.success('UPI details saved');
      await fetchData();
    } catch (error) {
      toast.error('Unable to save UPI details');
      console.error(error);
    } finally {
      setSavingUpi(false);
    }
  };

  const copyUpiId = async () => {
    if (!selectedPg?.upiId) return;
    try {
      await navigator.clipboard.writeText(selectedPg.upiId);
      toast.success('UPI ID copied');
    } catch (err) {
      console.error(err);
      toast.error('Copy failed');
    }
  };

  const markCashPaid = async (paymentId) => {
    try {
      if (String(paymentId).startsWith('pending-synthetic-')) {
        const tenantId = paymentId.replace('pending-synthetic-', '');
        const tenant = users.find((u) => String(u._id) === tenantId);
        if (!tenant) {
          toast.error('Tenant not found');
          return;
        }

        const amount = selectedPg?.rentPerBed || tenant.rentAmount || 0;
        const res = await paymentAPI.ownerConfirmCash({ tenantId, pgId: selectedPgId, amount });
        const newId = res?.data?.data?._id;
        if (newId) setRecentlyMarkedPaid((prev) => ({ ...prev, [newId]: true }));
        toast.success('Cash payment recorded and marked paid');
        await fetchData();
        return;
      }

      await paymentAPI.markPaymentPaid(paymentId);
      toast.success('Cash payment marked paid');
      setRecentlyMarkedPaid((prev) => ({ ...prev, [paymentId]: true }));
      await fetchData();
    } catch (error) {
      toast.error('Unable to mark payment paid');
      console.error(error);
    }
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

  const getPaymentStatusLabel = (payment) => {
    if (payment.status === 'success') {
      return payment.paymentMethod === 'cash' ? 'Paid in Cash' : 'Paid';
    }
    if (payment.status === 'pending') {
      return payment.paymentMethod === 'cash' ? 'Cash pending' : 'Pending';
    }
    return payment.status.charAt(0).toUpperCase() + payment.status.slice(1);
  };

  if (loading) {
    return <div className="p-6 text-center dark:text-white">Loading rent data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-400 dark:text-red-300">{error}</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <MdAttachMoney className="inline" /> Rent Management
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
            Review tenant rent payments and manage the scanner details tenants can show when paying.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={selectedPgId}
            onChange={(e) => {
              const newPgId = e.target.value;
              setSelectedPgId(newPgId);
              sessionStorage.setItem('selectedPgId', newPgId);
            }}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <option value="">All PGs</option>
            {pgs.map((pg) => (
              <option key={pg._id} value={pg._id}>
                {pg.pgName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <h3 className="px-6 pt-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Pending Payments</h3>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">PG / Room</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">In Cash</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {pendingPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg font-semibold text-blue-700 dark:text-blue-200">
                          {payment.tenantId.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.tenantId.fullName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{payment.tenantId.email}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{payment.tenantId.phone || 'No phone'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {payment.pgId.pgName}
                      <div className="text-xs text-gray-500">₹{payment.pgId.rentPerBed}/bed</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-2xl font-bold text-gray-900 dark:text-gray-100">₹{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{payment.paymentMethod ? payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1) : 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{payment.month} {payment.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)} {getPaymentStatusLabel(payment)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          onChange={async (e) => {
                            if (e.target.checked) {
                              await markCashPaid(payment._id);
                            }
                          }}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">In cash</span>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => sendReminder(payment.tenantId._id, payment.tenantId.fullName)}
                        disabled={sendingReminder[payment.tenantId._id]}
                        className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200"
                      >
                        <MdSend />
                        {sendingReminder[payment.tenantId._id] ? 'Sending...' : 'Reminder'}
                      </button>
                    </td>
                  </tr>
                ))}
                {pendingPayments.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No pending payments for selected PG</td>
                  </tr>
                )}
              </tbody>
            </table>

            <h3 className="px-6 pt-6 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Paid Payments</h3>
            <table className="w-full mb-6">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">PG / Room</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paidPayments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-lg font-semibold text-blue-700 dark:text-blue-200">{payment.tenantId.fullName.charAt(0)}</div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{payment.tenantId.fullName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{payment.tenantId.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{payment.pgId.pgName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-2xl font-bold text-gray-900 dark:text-gray-100">₹{payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{payment.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{payment.month} {payment.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>{getStatusIcon(payment.status)} {getPaymentStatusLabel(payment)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {recentlyMarkedPaid[payment._id] ? (
                        <button onClick={() => undoMarkPaid(payment._id)} disabled={undoing[payment._id]} className="inline-flex items-center gap-2 text-red-600 hover:text-red-900">Undo</button>
                      ) : (
                        <span className="text-sm text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {paidPayments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No paid records for selected PG</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">UPI / QR setup</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add or update the UPI ID tenants scan to pay rent.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {selectedPg ? 'Selected PG' : 'No PG selected'}
              </div>
            </div>

            {selectedPg ? (
              <div className="space-y-5">
                <div className="rounded-3xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 p-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">PG</div>
                  <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedPg.pgName}</div>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Current UPI: {selectedPg.upiId || 'Not set'}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Owner UPI ID</label>
                  <input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter owner UPI ID"
                    className="mt-2 w-full rounded-3xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                  />
                </div>

                <button
                  onClick={saveUpiId}
                  disabled={savingUpi}
                  className="inline-flex items-center justify-center rounded-3xl bg-blue-600 px-4 py-3 text-white transition hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {savingUpi ? 'Saving...' : 'Save UPI ID'}
                </button>

                <UPIQRCode
                  upiId={upiId || selectedPg?.upiId}
                  payeeName={selectedPg?.ownerId?.fullName || selectedPg?.pgName || ''}
                  label="owner-upi"
                  size={220}
                />
              </div>
            ) : (
              <div className="rounded-3xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 p-5 text-sm text-gray-500 dark:text-gray-400">
                Select a PG from the dropdown above to manage payment details.
              </div>
            )}
          </div>

          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Quick Owner Notes</h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <li>• Tenants will see only the UPI QR and UPI ID for rent payments.</li>
              <li>• Cash payments remain pending until you mark them paid.</li>
              <li>• Keep each PG UPI ID updated before the next due date.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
