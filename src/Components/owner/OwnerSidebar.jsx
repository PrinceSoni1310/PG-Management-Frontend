import { NavLink, Outlet, useNavigate } from "react-router-dom";

export const OwnerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-64 h-screen bg-gray-900 text-white p-5 fixed overflow-y-auto">

        {/* TITLE */}
        <h1 className="text-xl font-semibold mb-8 text-blue-400">
          PG Owner
        </h1>

        {/* MENU */}
        <ul className="space-y-3 text-sm">

          <li>
            <NavLink to="dashboard" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="rooms" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Rooms
            </NavLink>
          </li>

          <li>
            <NavLink to="tenants" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Tenants
            </NavLink>
          </li>

          <li>
            <NavLink to="rent" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Rent Management
            </NavLink>
          </li>

          <li>
            <NavLink to="payments" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Payments
            </NavLink>
          </li>

          <li>
            <NavLink to="food-menu" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Food Menu
            </NavLink>
          </li>

          <li>
            <NavLink to="notices" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Notices
            </NavLink>
          </li>

          <li>
            <NavLink to="complaints" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Complaints
            </NavLink>
          </li>

          <li>
            <NavLink to="settings" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Settings
            </NavLink>
          </li>

          {/* LOGOUT */}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded mt-6"
            >
              Logout
            </button>
          </li>

        </ul>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>

    </div>
  );
};