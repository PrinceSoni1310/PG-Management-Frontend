import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DarkModeToggle from '../DarkModeToggle';


export const TenantNavbar = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700">

        {/* TITLE */}
        <h1 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
          Tenant Panel
        </h1>

        {/* MENU */}
        <ul className="flex gap-6 text-sm font-medium items-center">

          <li>
            <NavLink to="dashboard" className={({ isActive }) =>
              isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            }>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="rent" className={({ isActive }) =>
              isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            }>
              Rent
            </NavLink>
          </li>

          <li>
            <NavLink to="food-menu" className={({ isActive }) =>
              isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            }>
              Food Menu
            </NavLink>
          </li>

          <li>
            <NavLink to="notices" className={({ isActive }) =>
              isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            }>
              Notices
            </NavLink>
          </li>

          <li>
            <NavLink to="complaints" className={({ isActive }) =>
              isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            }>
              Complaints
            </NavLink>
          </li>

          <li>
            <NavLink to="payments" className={({ isActive }) =>
              isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            }>
              Payments
            </NavLink>
          </li>

          <li>
            <NavLink to="profile" className={({ isActive }) =>
              isActive ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-700 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            }>
              Profile
            </NavLink>
          </li>

          {/* DARK MODE TOGGLE */}
          <li>
            <DarkModeToggle />
          </li>

          {/* LOGOUT */}
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </li>

        </ul>
      </nav>

      {/* PAGE CONTENT */}
      <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
        <Outlet />
      </div>
    </>
  );
};