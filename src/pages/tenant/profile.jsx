import React from 'react';
import { MdPerson, MdEmail, MdPhone, MdEdit } from 'react-icons/md';

export const Profile = () => {
  const user = {
    name: 'Hemang',
    email: 'Hemang@gmail.com',
    phone: '+91 9876543210'
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Profile
      </h1>

      <div className="bg-white shadow-md p-6 rounded-lg border max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
            <MdEdit className="mr-2" />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <MdPerson className="text-blue-500 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center">
            <MdEmail className="text-green-500 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center">
            <MdPhone className="text-purple-500 text-xl mr-3" />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-800">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
