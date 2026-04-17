import { useEffect, useState } from 'react';
import { authAPI } from '../../services/api';
import { toast } from 'react-toastify';

export const AdminTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getUsers();
      const users = res.data.data || [];
      setTenants(users.filter(user => user.role?.toLowerCase() === 'tenant'));
    } catch (error) {
      console.error('Error fetching tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        await authAPI.deleteUser(id);
        toast.success('Tenant deleted successfully');
        fetchTenants();
      } catch (error) {
        toast.error('Failed to delete tenant');
      }
    }
  };

  if (loading) {
    return <div className="p-6 text-center dark:text-gray-200 dark:bg-gray-900 min-h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Tenants</h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700">
          <thead className="bg-gray-800 dark:bg-gray-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Room ID</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
              <tr key={tenant._id} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{tenant.fullName}</td>
                <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{tenant.email}</td>
                <td className="px-6 py-3 text-gray-900 dark:text-gray-100">{tenant.roomId || 'Not assigned'}</td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 rounded text-white text-sm font-semibold bg-blue-500 dark:bg-blue-600">
                    Active
                  </span>
                </td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(tenant._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition duration-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tenants.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No tenants found.</p>
        </div>
      )}
    </div>
  );
};
