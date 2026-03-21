import { NavLink, Outlet, useNavigate } from "react-router-dom";

export const TenantNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">

        {/* TITLE */}
        <h1 className="text-lg font-semibold text-blue-600">
          Tenant Panel
        </h1>

        {/* MENU */}
        <ul className="flex gap-6 text-sm font-medium items-center">

          <li>
            <NavLink to="dashboard" className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="rent" className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }>
              Rent
            </NavLink>
          </li>

          <li>
            <NavLink to="food-menu" className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }>
              Food Menu
            </NavLink>
          </li>

          <li>
            <NavLink to="notices" className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }>
              Notices
            </NavLink>
          </li>

          <li>
            <NavLink to="complaints" className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }>
              Complaints
            </NavLink>
          </li>

          <li>
            <NavLink to="payments" className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }>
              Payments
            </NavLink>
          </li>

          <li>
            <NavLink to="profile" className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "hover:text-blue-600"
            }>
              Profile
            </NavLink>
          </li>

          {/* LOGOUT */}
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </li>

        </ul>
      </nav>

      {/* PAGE CONTENT */}
      <div className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
        <Outlet />
      </div>
    </>
  );
};