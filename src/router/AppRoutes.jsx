import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* PAGES */
import { Home } from "../pages/Home";
import { Login } from "../Components/Login";
import { SignUp } from "../Components/SignUp";

import { AdminSidebar } from "../Components/admin/AdminSidebar";
import { OwnerSidebar } from "../Components/owner/OwnerSidebar";
import { TenantNavbar } from "../Components/tennent/tenantNavbar";

import { OwnerDashboard } from "../pages/owner/OwnerDashboard";
import {Rooms} from "../pages/owner/rooms";
import {Tenants} from "../pages/owner/tenants";
import {RentManagement} from "../pages/owner/rentManagement";
import {Payments} from "../pages/owner/payments";
import {FoodMenuOwner} from "../pages/owner/foodMenu";
import {NoticesOwner} from "../pages/owner/notices";
import {ComplaintsOwner} from "../pages/owner/complaints";
import {Settings} from "../pages/owner/settings";

import { TenantDashboard } from "../pages/tenant/TenantDashboard";
import {RentDetails} from "../pages/tenant/rentDetails";
import {FoodMenuTenant} from "../pages/tenant/foodMenu";
import {NoticesTenant} from "../pages/tenant/notices";
import {ComplaintsTenant} from "../pages/tenant/complaints";
import {PaymentsTenant} from "../pages/tenant/payments";
import {Profile} from "../pages/tenant/profile";
import ProtectedRoutes from "../Components/ProtectedRoutes";
import { ForgotPassword } from "../Components/forgotPassword";
import { ResetPassword } from "../Components/ResetPassword";

const router = createBrowserRouter([
  /* HOME */
  {
    path: "/",
    element: <Home />,
  },

  /* AUTH */
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  {
    path : "/forgotpassword",
    element : <ForgotPassword/>
  },

  {
    path : "/resetpassword/:token",
    element : <ResetPassword/>
  },

  /* ADMIN */
  {
    path: "/admin",
    element: <AdminSidebar />,
  },

  {
    path: "/owner",
    element: 
    <ProtectedRoutes Roles={["Owner"]}>
    <OwnerSidebar />
    </ProtectedRoutes>,
    children: [
      { path: "dashboard", element: <OwnerDashboard /> },
      { path: "rooms", element: <Rooms /> },
      { path: "tenants", element: <Tenants /> },
      { path: "rent", element: <RentManagement /> },
      { path: "payments", element: <Payments /> },
      { path: "food-menu", element: <FoodMenuOwner /> },
      { path: "notices", element: <NoticesOwner /> },
      { path: "complaints", element: <ComplaintsOwner /> },
      { path: "settings", element: <Settings /> },
    ],
  },

  {
    path: "/tenant",
    element: 
    <ProtectedRoutes Roles={["Tenant"]}>
    <TenantNavbar />
    </ProtectedRoutes>,
    children: [
      { path: "dashboard", element: <TenantDashboard /> },
      { path: "rent", element: <RentDetails /> },
      { path: "food-menu", element: <FoodMenuTenant /> },
      { path: "notices", element: <NoticesTenant /> },
      { path: "complaints", element: <ComplaintsTenant /> },
      { path: "payments", element: <PaymentsTenant /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;