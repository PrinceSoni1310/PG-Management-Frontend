import React, { useState } from 'react';
import { MdAnnouncement, MdSend, MdDateRange } from 'react-icons/md';

export const NoticesOwner = () => {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Maintenance Schedule',
      description: 'Building maintenance will be conducted on 15th March from 10 AM to 2 PM. Please plan accordingly.',
      date: '2024-03-10'
    },
    {
      id: 2,
      title: 'New Rules',
      description: 'Visitors are now required to register at the front desk. This is for security purposes.',
      date: '2024-03-08'
    }
  ]);

  const [formData, setFormData] = useState({ title: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      const newNotice = {
        id: notices.length + 1,
        ...formData,
        date: new Date().toISOString().split('T')[0]
      };
      setNotices([newNotice, ...notices]);
      setFormData({ title: '', description: '' });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Notices Management
      </h1>

      {/* Notice Form */}
      <div className="bg-white shadow-md p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Create New Notice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notice title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Enter notice description"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            <MdSend className="mr-2" />
            Post Notice
          </button>
        </form>
      </div>

      {/* Notices List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Posted Notices</h2>
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white shadow-md p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <MdAnnouncement className="text-blue-500 text-2xl mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
              </div>
              <div className="flex items-center text-gray-500">
                <MdDateRange className="text-lg mr-1" />
                <span className="text-sm">{notice.date}</span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">{notice.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
