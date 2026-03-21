import { MdRoom, MdPeople, MdCheckCircle, MdAttachMoney, MdHistory } from 'react-icons/md';

export const OwnerDashboard = () => {
  const activities = [
    'New tenant added to Room 203',
    'Food menu updated for this week',
    'Complaint received from Room 105',
    'Payment received from Room 102',
    'Maintenance scheduled for Room 201'
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Owner Dashboard
      </h1>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MdRoom className="text-blue-500 text-2xl mr-3" />
            <h2 className="text-gray-600 font-medium">Total Rooms</h2>
          </div>
          <p className="text-2xl font-bold text-gray-800">20</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MdPeople className="text-green-500 text-2xl mr-3" />
            <h2 className="text-gray-600 font-medium">Occupied Rooms</h2>
          </div>
          <p className="text-2xl font-bold text-gray-800">16</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MdCheckCircle className="text-orange-500 text-2xl mr-3" />
            <h2 className="text-gray-600 font-medium">Available Rooms</h2>
          </div>
          <p className="text-2xl font-bold text-gray-800">4</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MdAttachMoney className="text-red-500 text-2xl mr-3" />
            <h2 className="text-gray-600 font-medium">Pending Rent</h2>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹12,000</p>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white shadow-md rounded-lg border p-6">
        <div className="flex items-center mb-6">
          <MdHistory className="text-gray-500 text-2xl mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        </div>
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};