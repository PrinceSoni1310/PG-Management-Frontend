import { useEffect, useState } from 'react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const AdminOwners = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getUsers();
      const users = res.data.data || [];
      setOwners(users.filter(user => user.role?.toLowerCase() === 'owner'));
    } catch (error) {
      console.error('Error fetching owners:', error);
      toast.error('Failed to load owners');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      try {
        await authAPI.deleteUser(id);
        toast.success('Owner deleted successfully');
        fetchOwners();
      } catch (error) {
        toast.error('Failed to delete owner');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
        <div className="text-center text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">PG Owners</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-200">
          <thead className="bg-gray-800 dark:bg-gray-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.map(owner => (
              <tr key={owner._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-3 text-gray-800 dark:text-gray-100">{owner.fullName}</td>
                <td className="px-6 py-3 text-gray-800 dark:text-gray-100">{owner.email}</td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 rounded text-white text-sm font-semibold bg-green-500 dark:bg-green-600">
                    Active
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(owner._id)}
                    className="bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 text-white px-3 py-1 rounded transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {owners.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center transition-colors duration-200">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No owners found.</p>
        </div>
      )}
    </div>
  );
};
