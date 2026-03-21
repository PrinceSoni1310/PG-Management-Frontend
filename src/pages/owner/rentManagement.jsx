import React from 'react';
import { MdAttachMoney, MdCheckCircle, MdError } from 'react-icons/md';

export const RentManagement = () => {
  const rentData = [
    { id: 1, tenant: 'John Doe', amount: 6000, status: 'Paid' },
    { id: 2, tenant: 'Jane Smith', amount: 6000, status: 'Paid' },
    { id: 3, tenant: 'Bob Johnson', amount: 6000, status: 'Pending' },
    { id: 4, tenant: 'Alice Brown', amount: 6000, status: 'Overdue' }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Rent Management
      </h1>

      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rentData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <MdAttachMoney className="text-blue-500 mr-2" />
                    {item.tenant}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'Paid' ? 'bg-green-100 text-green-800' :
                    item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status === 'Paid' ? (
                      <MdCheckCircle className="mr-1" />
                    ) : item.status === 'Pending' ? (
                      <MdError className="mr-1" />
                    ) : (
                      <MdError className="mr-1" />
                    )}
                    {item.status}
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
