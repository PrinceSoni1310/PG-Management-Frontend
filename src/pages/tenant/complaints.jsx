import React, { useState } from 'react';
import { MdReport, MdSend } from 'react-icons/md';

export const ComplaintsTenant = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'Leaky Faucet', description: 'The washroom faucet is leaking.', date: '2024-03-12', status: 'Pending' },
    { id: 2, title: 'Noisy Neighbors', description: 'Neighbors are too loud at night.', date: '2024-03-10', status: 'Resolved' }
  ]);

  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      const newComplaint = {
        id: complaints.length + 1,
        ...formData,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      setComplaints([newComplaint, ...complaints]);
      setFormData({ title: '', description: '' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Complaints
      </h1>

      {/* Complaint Form */}
      <div className="bg-white shadow-md p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Submit New Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter complaint title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Describe your complaint"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <MdSend className="mr-2" />
            Submit Complaint
          </button>
        </form>
      </div>

      {/* Complaints List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Your Complaints</h2>
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white shadow-md p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <MdReport className="text-red-500 text-2xl mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {complaint.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{complaint.description}</p>
            <p className="text-sm text-gray-500">Date: {complaint.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
