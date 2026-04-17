import React, { useState, useEffect } from 'react';
import { MdAttachMoney, MdDateRange, MdCheckCircle, MdError, MdPayment, MdHistory } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';
import { paymentAPI } from '../../services/api';
import ScriptTag from 'react-script-tag';

import { QRCodeCanvas } from 'qrcode.react';
import { pgAPI, paymentAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';\n\nexport const RentDetails = () => {
  const { auth } = useAuth();
  const [rentData, setRentData] = useState({
    totalRent: 5000, // Replace with real room/pg rentPerBed
    dueDate: new Date(),
    status: 'Pending'
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState('pending');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [message, setMessage] = useState('');

  const tenantId = '67c3c8b2d5f5e4a8b9c0d1e2'; // TODO: Get from auth.user._id or localStorage.userId
  const pgId = '67c3c8b2d5f5e4a8b9c0d1e3'; // TODO: Get from user.pgId

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchPayments();
    checkCurrentMonthPayment();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentAPI.getAllPayments();
      const tenantPayments = response.data.filter(p => p.tenantId.toString() === tenantId);
      setPayments(tenantPayments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentMonthPayment = async () => {
    try {
      const response = await paymentAPI.getPayments(tenantId);
      const currentMonthPayment = response.data.find(p => 
        p.month === currentMonth && p.year === currentYear
      );
      if (currentMonthPayment) {
        setCurrentPaymentStatus(currentMonthPayment.status);
        setRentData(prev => ({ ...prev, status: currentMonthPayment.status.charAt(0).toUpperCase() + currentMonthPayment.status.slice(1) }));
      }
    } catch (error) {
      console.error('Error checking payment:', error);
    }
  };

  const handlePayRent = async () => {
    if (currentPaymentStatus !== 'pending' && currentPaymentStatus !== 'failed') {
      setMessage('Payment already completed for this month');
      return;
    }

    setPayLoading(true);
    try {
      // 1. Create order
      const orderResponse = await paymentAPI.createOrder({
        amount: rentData.totalRent,
        month: currentMonth,
        year: currentYear,
        pgId
      });

      // 2. Load Razorpay SDK if not loaded
      if (!window.Razorpay) {
        // Load script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setRazorpayLoaded(true);
          openRazorpay(orderResponse.data);
        };
        document.body.appendChild(script);
      } else {
        setRazorpayLoaded(true);
        openRazorpay(orderResponse.data);
      }
    } catch (error) {
      setMessage('Error creating order: ' + error.response?.data?.message || error.message);
    } finally {
      setPayLoading(false);
    }
  };

  const openRazorpay = (orderData) => {
    const options = {
      key: orderData.key_id, // from .env
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'PG Management Rent',
      description: `Rent payment for ${currentMonth} ${currentYear}`,
      order_id: orderData.order_id,
      handler: async function (response) {
        // 3. Verify payment
        try {
          await paymentAPI.verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          setMessage('Payment successful!');
          setCurrentPaymentStatus('success');
          setRentData(prev => ({ ...prev, status: 'Success' }));
          fetchPayments();
          checkCurrentMonthPayment();
        } catch (error) {
          setMessage('Payment verification failed');
          setCurrentPaymentStatus('failed');
        }
      },
      prefill: {
        name: 'Tenant Name',
        email: 'tenant@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#10b981'
      },
      modal: {
        ondismiss: function() {
          setMessage('Payment cancelled');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const getStatusIcon = (status) => {
    if (status === 'success' || status === 'Paid') return MdCheckCircle;
    return MdError;
  };

  const StatusIcon = getStatusIcon(currentPaymentStatus);

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Rent Management
        </h1>
      </div>

      {/* Rent Breakdown Card */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
          <MdAttachMoney className="mr-2" />
          Current Rent
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Monthly Rent</span>
            <span className="font-semibold text-2xl text-gray-900 dark:text-gray-100">₹{rentData.totalRent}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Due Date</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {rentData.dueDate.toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <StatusIcon className={`text-xl mr-3 ${currentPaymentStatus === 'success' || currentPaymentStatus === 'paid' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`} />
              <span className="text-gray-600 dark:text-gray-300">Status</span>
            </div>
            <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
              currentPaymentStatus === 'success' || currentPaymentStatus === 'paid' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {rentData.status}
            </span>
          </div>

          <button
            onClick={handlePayRent}
            disabled={payLoading || (currentPaymentStatus === 'success' || currentPaymentStatus === 'paid')}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed disabled:scale-100"
          >
            {payLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <MdPayment className="mr-2" />
                Pay Now ₹{rentData.totalRent}
              </>
            )}
          </button>

          {message && (
            <div className={`p-3 rounded-lg mt-4 text-sm ${
              message.includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <MdHistory className="text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-fetch-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {payments.slice().reverse().map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    ₹{payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'success' || payment.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      <StatusIcon className="mr-1 -ml-0.5 h-3.5 w-3.5 flex-shrink-0" />
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No payment history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
