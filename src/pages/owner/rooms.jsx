import React, { useEffect, useState } from 'react';
import { MdRoom, MdAdd, MdCheckCircle, MdCancel, MdDelete } from 'react-icons/md';
import { roomAPI, pgAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ roomNumber: '', totalBeds: '' });
  const [selectedPgId, setSelectedPgId] = useState('');
  const [approvedPgs, setApprovedPgs] = useState([]);

  useEffect(() => {
    const pgId = localStorage.getItem('selectedPgId');
    if (pgId) {
      setSelectedPgId(pgId);
      fetchRooms(pgId);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const response = await pgAPI.getPGs();
        const allPgs = response.data.data || [];
        const approved = allPgs.filter(pg => pg.status === "approved");
        setApprovedPgs(approved);

        if (approved.length > 0 && (!selectedPgId || !approved.find(pg => pg._id === selectedPgId))) {
          const savedPgId = localStorage.getItem('selectedPgId');
          if (savedPgId && approved.find(pg => pg._id === savedPgId)) {
            setSelectedPgId(savedPgId);
          } else {
            const newPgId = approved[0]._id;
            setSelectedPgId(newPgId);
            localStorage.setItem('selectedPgId', newPgId);
            fetchRooms(newPgId);
          }
        }
      } catch (error) {
        console.error('Error fetching PGs:', error);
      }
    };
    fetchPGs();
  }, []);

  const fetchRooms = async (pgId) => {
    try {
      setLoading(true);
      const response = await roomAPI.getRooms(pgId);
      setRooms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error(error.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!form.roomNumber || !form.totalBeds) {
      toast.error('Please enter room number and bed count');
      return;
    }
    if (!selectedPgId) {
      toast.error('PG not found. Please select a PG first.');
      return;
    }
    try {
      await roomAPI.createRoom({
        pgId: selectedPgId,
        roomNumber: Number(form.roomNumber),
        totalBeds: Number(form.totalBeds),
        occupiedBeds: 0,
        occupants: []
      });
      toast.success('Room added successfully');
      setShowAddModal(false);
      setForm({ roomNumber: '', totalBeds: '' });
      fetchRooms(selectedPgId);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await roomAPI.deleteRoom(roomId);
      toast.success('Room deleted successfully');
      fetchRooms(selectedPgId);
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  };

  const formatStatus = (room) => {
    const occupied = room.occupants?.length ?? room.occupiedBeds ?? 0;
    return occupied >= (room.totalBeds || 1) ? 'Occupied' : 'Available';
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Rooms</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage room setup for the selected PG.</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPgId}
            onChange={(e) => {
              const newPgId = e.target.value;
              setSelectedPgId(newPgId);
              localStorage.setItem('selectedPgId', newPgId);
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
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center"
          >
            <MdAdd className="mr-2" />
            Add Room
          </button>
        </div>
      </div>

      {!selectedPgId ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No PG selected. Please go to Dashboard and select a PG first.</div>
      ) : loading ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading rooms...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Room Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total Beds</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Occupied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
              {rooms.map((room) => {
                const occupied = room.occupants?.length ?? room.occupiedBeds ?? 0;
                return (
                  <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      <div className="flex items-center">
                        <MdRoom className="text-blue-500 dark:text-blue-400 mr-2" />
                        {room.roomNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{room.totalBeds}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{occupied}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        formatStatus(room) === 'Occupied' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {formatStatus(room) === 'Occupied' ? <MdCheckCircle className="mr-1" /> : <MdCancel className="mr-1" />}
                        {formatStatus(room)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        title="Delete Room"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rooms.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No rooms found. Click Add Room to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Add Room</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Room Number</label>
                <input
                  type="number"
                  value={form.roomNumber}
                  onChange={(e) => setForm(prev => ({ ...prev, roomNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter room number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Beds</label>
                <input
                  type="number"
                  value={form.totalBeds}
                  onChange={(e) => setForm(prev => ({ ...prev, totalBeds: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Enter total beds"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleCreateRoom}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Save Room
              </button>
              <button
                onClick={() => { setShowAddModal(false); setForm({ roomNumber: '', totalBeds: '' }); }}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
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
