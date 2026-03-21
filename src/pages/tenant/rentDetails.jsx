import React from 'react';
import { MdAttachMoney, MdDateRange, MdCheckCircle, MdError } from 'react-icons/md';

export const RentDetails = () => {
  const rentData = {
    totalRent: 6000,
    dueDate: '2024-04-01',
    status: 'Paid' // or 'Unpaid'
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Rent Details
      </h1>

      <div className="bg-white shadow-md p-6 rounded-lg border max-w-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Rent Breakdown</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdAttachMoney className="text-green-500 text-xl mr-3" />
              <span className="text-gray-600">Total Rent</span>
            </div>
            <span className="font-semibold">₹{rentData.totalRent}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdDateRange className="text-blue-500 text-xl mr-3" />
              <span className="text-gray-600">Due Date</span>
            </div>
            <span className="font-semibold">{rentData.dueDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {rentData.status === 'Paid' ? (
                <MdCheckCircle className="text-green-500 text-xl mr-3" />
              ) : (
                <MdError className="text-red-500 text-xl mr-3" />
              )}
              <span className="text-gray-600">Status</span>
            </div>
            <span className={`font-semibold ${rentData.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
              {rentData.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
