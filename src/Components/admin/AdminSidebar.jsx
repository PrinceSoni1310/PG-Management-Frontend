import { NavLink, Outlet } from "react-router-dom";
import DarkModeToggle from '../DarkModeToggle';

export const AdminSidebar = () => {
  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-60 h-screen bg-gray-900 text-white p-4 fixed">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold text-blue-400">
            Super Admin
          </h1>
          <DarkModeToggle />
        </div>

        <ul className="space-y-3 text-sm">

          <li>
            <NavLink to="dashboard" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="pg-list" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              PG List
            </NavLink>
          </li>

          <li>
            <NavLink to="owners" className={({ isActive }) =>
              isActive ? "block bg-blue-600 px-3 py-2 rounded" : "block hover:bg-gray-800 px-3 py-2 rounded"
            }>
              PG Owners
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
            <button className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded mt-4">
              Logout
            </button>
          </li>

        </ul>
      </div>

      {/* CONTENT */}
      <div className="flex-1 ml-60 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <Outlet />
      </div>

    </div>
  );
};