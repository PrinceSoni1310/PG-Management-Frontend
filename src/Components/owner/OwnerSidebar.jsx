import { NavLink, Outlet, useNavigate } from "react-router-dom";
import DarkModeToggle from '../DarkModeToggle';

export const OwnerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-64 h-screen bg-white dark:bg-gray-900 shadow-lg text-gray-900 dark:text-gray-100 p-6 fixed overflow-y-auto border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40">
        
        {/* TITLE */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">
            PG Owner
          </h1>
          <DarkModeToggle />
        </div>

        {/* MENU */}
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="dashboard" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="rooms" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Rooms
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="tenants" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Tenants
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="rent" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Rent Management
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="payments" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Payments
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="food-menu" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Food Menu
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="notices" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Notices
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="tenant-requests" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Tenant Requests
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="complaints" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Complaints
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="settings" 
              className={({ isActive }) =>
                isActive 
                  ? "block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-600/50 ring-2 ring-blue-500/30 transform scale-[1.02] transition-all duration-200 font-medium text-sm" 
                  : "block px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-gray-300"
              }
            >
              Settings
            </NavLink>
          </li>

          {/* LOGOUT */}
          <li className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border border-transparent hover:border-red-500/30 active:scale-[0.98]"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* PAGE CONTENT */}
      <div className="flex-1 ml-64 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <Outlet />
      </div>

    </div>
  );
};