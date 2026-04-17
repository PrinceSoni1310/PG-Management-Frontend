import React, { useState, useEffect } from 'react';
import { MdPerson, MdAdd, MdPhone, MdEdit, MdDelete, MdMeetingRoom, MdCheck } from 'react-icons/md';
import { authAPI, roomAPI, pgAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedPgId, setSelectedPgId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTenant, setNewTenant] = useState({ fullName: '', email: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullName: '', email: '', phone: '', address: '' });
  const [approvedPgs, setApprovedPgs] = useState([]);

  useEffect(() => {
    const pgId = localStorage.getItem('selectedPgId');
    if (pgId) {
      setSelectedPgId(pgId);
      fetchTenants(pgId);
      fetchRooms(pgId);
    }
  }, []);

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const response = await pgAPI.getPGs();
        const allPgs = response.data.data || [];
        const approved = allPgs.filter(pg => pg.status === "approved");
        setApprovedPgs(approved);

        // Validate and set selectedPgId
        if (approved.length > 0 && (!selectedPgId || !approved.find(pg => pg._id === selectedPgId))) {
          const savedPgId = localStorage.getItem('selectedPgId');
          if (savedPgId && approved.find(pg => pg._id === savedPgId)) {
            setSelectedPgId(savedPgId);
          } else {
            const newPgId = approved[0]._id;
            setSelectedPgId(newPgId);
            localStorage.setItem('selectedPgId', newPgId);
          }
        }
      } catch (error) {
        console.error('Error fetching PGs:', error);
      }
    };
    fetchPGs();
  }, []);

  const fetchTenants = async (pgId) => {
    try {
      const response = await authAPI.getUsers();
      const allUsers = response.data.data || [];
      const pgTenants = allUsers.filter(user =>
        String(user.role || '').toLowerCase() === 'tenant' && String(user.pgId || '') === String(pgId)
      );
      setTenants(pgTenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async (pgId) => {
    try {
      const response = await roomAPI.getRooms(pgId);
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
    }
  };

  const handleAssignRoom = async () => {
    if (!selectedTenant || !selectedRoom) {
      toast.error('Please select a tenant and room');
      return;
    }

    try {
      // Update tenant's roomId
      await authAPI.updateUser(selectedTenant._id, { roomId: selectedRoom });

      // Update room's occupants
      const room = rooms.find(r => r._id === selectedRoom);
      if (room) {
        const updatedOccupants = [...(room.occupants || []), selectedTenant._id];
        await roomAPI.updateRoom(selectedRoom, { occupants: updatedOccupants });
      }

      toast.success('Room assigned successfully');
      setShowAssignModal(false);
      setSelectedTenant(null);
      setSelectedRoom('');

      // Refresh data
      fetchTenants(selectedPgId);
      fetchRooms(selectedPgId);
    } catch (error) {
      console.error('Error assigning room:', error);
      toast.error('Failed to assign room');
    }
  };

  const getRoomNumber = (roomId) => {
    const room = rooms.find(r => r._id === roomId);
    return room ? room.roomNumber : 'Not Assigned';
  };

  const getAvailableRooms = () => {
    return rooms.filter(room => {
      const maxOccupants = room.totalBeds || 1;
      const currentOccupants = room.occupants?.length ?? room.occupiedBeds ?? 0;
      return currentOccupants < maxOccupants;
    });
  };

  const handleDeleteTenant = async (tenantId) => {
    if (!window.confirm('Are you sure you want to delete this tenant?')) return;
    try {
      await authAPI.deleteUser(tenantId);
      toast.success('Tenant deleted successfully');
      fetchTenants(selectedPgId);
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Failed to delete tenant');
    }
  };

  const handleAddTenant = async () => {
    if (!newTenant.fullName || !newTenant.email) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await authAPI.register({
        fullName: newTenant.fullName,
        email: newTenant.email,
        role: 'Tenant',
        pgId: selectedPgId
      });
      toast.success('Tenant added successfully');
      setShowAddModal(false);
      setNewTenant({ fullName: '', email: '' });
      fetchTenants(selectedPgId);
    } catch (error) {
      console.error('Error adding tenant:', error);
      toast.error('Failed to add tenant');
    }
  };

  const handleEdit = (tenant) => {
    setEditingTenant(tenant);
    setEditFormData({
      fullName: tenant.fullName || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      address: tenant.address || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateTenant = async () => {
    if (!editingTenant || !editFormData.fullName || !editFormData.email) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      await authAPI.updateUser(editingTenant._id, editFormData);
      toast.success('Tenant updated successfully');
      setShowEditModal(false);
      setEditingTenant(null);
      setEditFormData({ fullName: '', email: '', phone: '', address: '' });
      fetchTenants(selectedPgId);
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast.error('Failed to update tenant');
    }
  };

  if (loading) {
    return (
      <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
        <div className="text-center">Loading tenants...</div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tenants Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPgId}
            onChange={(e) => {
              const newPgId = e.target.value;
              setSelectedPgId(newPgId);
              localStorage.setItem('selectedPgId', newPgId);
              fetchTenants(newPgId);
              fetchRooms(newPgId);
            }}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {approvedPgs.map(pg => (
              <option key={pg._id} value={pg._id}>
                {pg.pgName}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <MdMeetingRoom className="mr-2" />
            Assign Room
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <MdAdd className="mr-2" />
            Add Tenant
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Room</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {tenants.map((tenant) => (
              <tr key={tenant._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  <div className="flex items-center">
                    <MdPerson className="text-blue-500 dark:text-blue-400 mr-3 text-lg" />
                    {tenant.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{tenant.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tenant.roomId ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {getRoomNumber(tenant.roomId)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  <div className="flex items-center">
                    <MdPhone className="text-green-500 dark:text-green-400 mr-2" />
                    {tenant.phone || 'Not provided'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTenant(tenant);
                        setShowAssignModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                      title="Assign Room"
                    >
                      <MdMeetingRoom className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleEdit(tenant)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                      title="Edit"
                    >
                      <MdEdit className="text-lg" />
                    </button>
                    <button onClick={() => handleDeleteTenant(tenant._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1" title="Remove">
                      <MdDelete className="text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No tenants found for this PG
          </div>
        )}
      </div>

      {/* ROOM ASSIGNMENT MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Assign Room</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Tenant</label>
              <select
                value={selectedTenant?._id || ''}
                onChange={(e) => {
                  const tenant = tenants.find(t => t._id === e.target.value);
                  setSelectedTenant(tenant);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Choose a tenant</option>
                {tenants.map(tenant => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.fullName} ({getRoomNumber(tenant.roomId)})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Room</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Choose a room</option>
                {getAvailableRooms().map(room => (
                  <option key={room._id} value={room._id}>
                    Room {room.roomNumber} ({room.occupants ? room.occupants.length : 0}/{room.bedCount || 1} occupied)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAssignRoom}
                className="flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <MdCheck className="mr-2" />
                Assign
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTenant(null);
                  setSelectedRoom('');
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TENANT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add New Tenant</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={newTenant.fullName}
                onChange={(e) => setNewTenant({ ...newTenant, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter full name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={newTenant.email}
                onChange={(e) => setNewTenant({ ...newTenant, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter email"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleAddTenant}
                className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <MdAdd className="mr-2" />
                Add Tenant
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewTenant({ fullName: '', email: '' });
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TENANT MODAL */}
      {showEditModal && editingTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Edit Tenant</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter full name"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Enter phone number"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
              <textarea
                rows={3}
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-vertical"
                placeholder="Enter address"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleUpdateTenant}
                className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center"
              >
                <MdCheck className="mr-2" />
                Update Tenant
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTenant(null);
                  setEditFormData({ fullName: '', email: '', phone: '', address: '' });
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
