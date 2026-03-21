import React from 'react';
import { MdRoom, MdAdd, MdCheckCircle, MdCancel } from 'react-icons/md';

export const Rooms = () => {
  const rooms = [
    { number: 101, type: 'Single', status: 'Occupied' },
    { number: 102, type: 'Double', status: 'Occupied' },
    { number: 103, type: 'Single', status: 'Available' },
    { number: 104, type: 'Double', status: 'Occupied' },
    { number: 105, type: 'Single', status: 'Available' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rooms</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
          <MdAdd className="mr-2" />
          Add Room
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.number}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <MdRoom className="text-blue-500 mr-2" />
                    {room.number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    room.status === 'Occupied' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {room.status === 'Occupied' ? (
                      <MdCheckCircle className="mr-1" />
                    ) : (
                      <MdCancel className="mr-1" />
                    )}
                    {room.status}
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
