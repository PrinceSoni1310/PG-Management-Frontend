import React from 'react';
import { MdPerson, MdAdd, MdPhone } from 'react-icons/md';

export const Tenants = () => {
  const tenants = [
    { id: 1, name: 'Hemang', room: 101, contact: '+91 9876543210' },
    { id: 2, name: 'Raj', room: 102, contact: '+91 9876543211' },
    { id: 3, name: 'Dhrudip', room: 104, contact: '+91 9876543212' },
    { id: 4, name: 'Om', room: 201, contact: '+91 9876543213' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tenants</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
          <MdAdd className="mr-2" />
          Add Tenant
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    <MdPerson className="text-blue-500 mr-2" />
                    {tenant.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tenant.room}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <MdPhone className="text-green-500 mr-2" />
                    {tenant.contact}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
