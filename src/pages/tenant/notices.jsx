import React from 'react';
import { MdAnnouncement, MdDateRange } from 'react-icons/md';

export const NoticesTenant = () => {
  const notices = [
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
    },
    {
      id: 3,
      title: 'Water Supply',
      description: 'Water supply will be interrupted tomorrow from 9 AM to 11 AM for pipeline maintenance.',
      date: '2024-03-05'
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Notices
      </h1>

      <div className="space-y-6">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white shadow-md p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <MdAnnouncement className="text-blue-500 text-2xl mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">{notice.title}</h2>
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
