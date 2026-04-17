import React, { useState, useEffect } from "react";
import { MdPayment, MdCheckCircle, MdError, MdDownload } from "react-icons/md";
import { paymentAPI } from "../../services/api";
import jsPDF from 'jspdf';

export const PaymentsTenant = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await paymentAPI.getTenantPayments();

      let data = response?.data?.data || [];

      // ✅ SORT LATEST FIRST
      data = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
      case "paid":
        return <MdCheckCircle className="text-green-500 mr-1" />;
      case "pending":
        return <MdPayment className="text-yellow-500 mr-1" />;
      default:
        return <MdError className="text-red-500 mr-1" />;
    }
  };

  const handleDownloadReceipt = (payment) => {
    const doc = new jsPDF();
    
    const tenantName = payment.tenantId?.fullName || 'N/A';
    const pgName = payment.pgId?.pgName || 'N/A';
    const paymentId = payment._id || `receipt_${Date.now()}`;
    const date = new Date(payment.paymentDate || payment.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long', 
      year: 'numeric'
    });
    
    // Title
    doc.setFontSize(20);
    doc.text('PG MANAGEMENT SYSTEM', 105, 30, { align: 'center' });
    
    // Line
    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);
    
    // Details
    let yPos = 50;
    doc.setFontSize(12);
    doc.text(`Tenant: ${tenantName}`, 20, yPos);
    yPos += 10;
    doc.text(`PG: ${pgName}`, 20, yPos);
    yPos += 10;
    doc.text(`Amount: ₹${payment.amount}`, 20, yPos);
    yPos += 10;
    doc.text(`Method: ${payment.paymentMethod?.toUpperCase() || 'N/A'}`, 20, yPos);
    yPos += 10;
    doc.text(`Status: ${payment.status?.toUpperCase() || 'N/A'}`, 20, yPos);
    yPos += 10;
    doc.text(`Date: ${date}`, 20, yPos);
    yPos += 10;
    doc.text(`Payment ID: ${paymentId}`, 20, yPos);
    
    // Bottom line
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;
    
    // Thank you
    doc.text('Thank you for your payment!', 105, yPos, { align: 'center' });
    
    // Save
    doc.save(`receipt_${paymentId}.pdf`);
  };

  if (loading) {
    return (
      <div className="p-6 text-center dark:text-white">Loading payments...</div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
          <MdPayment className="mr-3" />
          Payment History
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  PG
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold uppercase">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Receipt
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {/* DATE */}
                  <td className="px-6 py-4 text-sm">
                    {new Date(
                      payment.paymentDate || payment.createdAt
                    ).toLocaleDateString()}
                  </td>

                  {/* MONTH */}
                  <td className="px-6 py-4 text-sm">
                    {payment.month} {payment.year}
                  </td>

                  {/* PG */}
                  <td className="px-6 py-4 text-sm">
                    {payment.pgId?.pgName || "N/A"}
                  </td>

                  {/* AMOUNT */}
                  <td className="px-6 py-4 text-right text-lg font-bold">
                    ₹{payment.amount}
                  </td>

                  {/* METHOD */}
                  <td className="px-6 py-4 text-sm">
                    {payment.paymentMethod?.toUpperCase() || "N/A"}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>

                  {/* RECEIPT */}
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDownloadReceipt(payment)}
                      className="text-blue-600 hover:text-blue-800 flex items-center transition-colors cursor-pointer"
                    >
                      <MdDownload className="mr-1" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-400">
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