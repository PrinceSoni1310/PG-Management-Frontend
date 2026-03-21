import React, { useState } from 'react';
import { MdReport, MdCheckCircle, MdError } from 'react-icons/md';

export const ComplaintsOwner = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, tenant: 'Hemang', room: 101, title: 'Leaky Faucet', description: 'The kitchen faucet is leaking.', date: '2024-03-12', status: 'Pending' },
    { id: 2, tenant: 'Raj', room: 102, title: 'Noisy Neighbors', description: 'Neighbors are too loud at night.', date: '2024-03-10', status: 'Resolved' },
    { id: 3, tenant: 'Dhrudip', room: 104, title: 'Internet Issue', description: 'WiFi is not working properly.', date: '2024-03-08', status: 'Pending' }
  ]);

  const toggleStatus = (id) => {
    setComplaints(complaints.map(complaint =>
      complaint.id === id
        ? { ...complaint, status: complaint.status === 'Pending' ? 'Resolved' : 'Pending' }
        : complaint
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Complaints Management
      </h1>

      <div className="space-y-6">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white shadow-md p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <MdReport className="text-red-500 text-2xl mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                  <p className="text-sm text-gray-500">Room {complaint.room} - {complaint.tenant}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {complaint.status === 'Pending' ? (
                    <MdError className="mr-1" />
                  ) : (
                    <MdCheckCircle className="mr-1" />
                  )}
                  {complaint.status}
                </span>
                <button
                  onClick={() => toggleStatus(complaint.id)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    complaint.status === 'Pending'
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                  }`}
                >
                  {complaint.status === 'Pending' ? 'Resolve' : 'Mark Pending'}
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{complaint.description}</p>
            <p className="text-sm text-gray-500">Date: {complaint.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
