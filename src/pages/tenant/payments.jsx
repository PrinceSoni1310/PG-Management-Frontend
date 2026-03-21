import React from 'react';
import { MdPayment, MdCheckCircle, MdError } from 'react-icons/md';

export const PaymentsTenant = () => {
  const payments = [
    { id: 1, amount: 6000, date: '2024-03-01', status: 'Paid' },
    { id: 2, amount: 6000, date: '2024-02-01', status: 'Paid' },
    { id: 3, amount: 6000, date: '2024-01-01', status: 'Paid' },
    { id: 4, amount: 6000, date: '2023-12-01', status: 'Overdue' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Payment History
      </h1>

      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status === 'Paid' ? (
                      <MdCheckCircle className="mr-1" />
                    ) : (
                      <MdError className="mr-1" />
                    )}
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
