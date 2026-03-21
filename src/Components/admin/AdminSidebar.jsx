import { NavLink, Outlet } from "react-router-dom";

export const AdminSidebar = () => {
  return (
    <div className="flex">

      {/* SIDEBAR */}
      <div className="w-60 h-screen bg-gray-900 text-white p-4 fixed">

        <h1 className="text-lg font-semibold mb-6 text-blue-400">
          Super Admin
        </h1>

        <ul className="space-y-3 text-sm">

          <li>
            <NavLink to="dashboard" className="block hover:bg-gray-800 px-3 py-2 rounded">
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="pg-list" className="block hover:bg-gray-800 px-3 py-2 rounded">
              PG List
            </NavLink>
          </li>

          <li>
            <NavLink to="owners" className="block hover:bg-gray-800 px-3 py-2 rounded">
              PG Owners
            </NavLink>
          </li>

          <li>
            <NavLink to="tenants" className="block hover:bg-gray-800 px-3 py-2 rounded">
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
      <div className="flex-1 ml-60 p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </div>

    </div>
  );
};