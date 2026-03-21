import { MdRoom, MdAttachMoney, MdPayment } from 'react-icons/md';

export const TenantDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Tenant Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow-md p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MdRoom className="text-blue-500 text-2xl mr-3" />
            <h2 className="text-gray-600 font-medium">Room Number</h2>
          </div>
          <p className="text-2xl font-semibold text-gray-800">203</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MdAttachMoney className="text-green-500 text-2xl mr-3" />
            <h2 className="text-gray-600 font-medium">Monthly Rent</h2>
          </div>
          <p className="text-2xl font-semibold text-gray-800">₹6000</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg border">
          <div className="flex items-center mb-4">
            <MdPayment className="text-purple-500 text-2xl mr-3" />
            <h2 className="text-gray-600 font-medium">Payment Status</h2>
          </div>
          <p className="text-2xl font-semibold text-green-600">Paid</p>
        </div>
      </div>
    </div>
  );
};