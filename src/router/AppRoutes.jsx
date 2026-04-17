import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "../contexts/ThemeContext";

/* PAGES */
import { Home } from "../pages/Home";
import Login from "../Components/Login";
import { SignUp } from "../Components/SignUp";

import { AdminSidebar } from "../Components/admin/AdminSidebar";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { AdminPendingRequests } from "../pages/admin/AdminPendingRequests";
import { AdminPGList } from "../pages/admin/AdminPGList";
import { AdminOwners } from "../pages/admin/AdminOwners";
import { AdminTenants } from "../pages/admin/AdminTenants";

import { OwnerSidebar } from "../Components/owner/OwnerSidebar";
import { TenantNavbar } from "../Components/tennent/tenantNavbar";

import { OwnerDashboard } from "../pages/owner/OwnerDashboard";
import { Rooms } from "../pages/owner/rooms";
import { Tenants } from "../pages/owner/tenants";
import { RentManagement } from "../pages/owner/rentManagement";
import { Payments } from "../pages/owner/payments";
import { FoodMenuOwner } from "../pages/owner/foodMenu";
import { NoticesOwner } from "../pages/owner/notices";
import { ComplaintsOwner } from "../pages/owner/complaints";
import { Settings } from "../pages/owner/settings";
import { TenantRequests } from "../pages/owner/TenantRequests";
import { CreatePG } from "../pages/owner/CreatePG";
import { PendingApproval } from "../pages/owner/PendingApproval";

import { TenantDashboard } from "../pages/tenant/TenantDashboard";
import { RentDetails } from "../pages/tenant/rentDetails";
import { FoodMenuTenant } from "../pages/tenant/foodMenu";
import { NoticesTenant } from "../pages/tenant/notices";
import { ComplaintsTenant } from "../pages/tenant/complaints";
import { PaymentsTenant } from "../pages/tenant/payments";
import { Profile } from "../pages/tenant/profile";
import ProtectedRoutes from "../Components/ProtectedRoutes";
import { ForgotPassword } from "../Components/forgotPassword";
import { ResetPassword } from "../Components/ResetPassword";
// import { BookingComponent } from "../Components/BookingComponent";

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
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },

  {
    path: "/resetpassword/:token",
    element: <ResetPassword />,
  },
  // { path: "/booking", element: <BookingComponent /> },

  /* OWNER REGISTRATION FLOW */
  {
    path: "/owner/create-pg",
    element: (
      <ProtectedRoutes Roles={["owner"]}>
        <CreatePG />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/owner/pending-approval",
    element: <PendingApproval />,
  },

  /* ADMIN */
  {
    path: "/admin",
    element: <AdminSidebar />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "pending-requests", element: <AdminPendingRequests /> },
      { path: "pg-list", element: <AdminPGList /> },
      { path: "owners", element: <AdminOwners /> },
      { path: "tenants", element: <AdminTenants /> },
    ],
  },

  {
    path: "/owner",
    element: (
      <ProtectedRoutes Roles={["owner"]}>
        <OwnerSidebar />
      </ProtectedRoutes>
    ),
    children: [
      { path: "dashboard", element: <OwnerDashboard /> },
      { path: "rooms", element: <Rooms /> },
      { path: "tenants", element: <Tenants /> },
      { path: "rent", element: <RentManagement /> },
      { path: "payments", element: <Payments /> },
      { path: "food-menu", element: <FoodMenuOwner /> },
      { path: "notices", element: <NoticesOwner /> },
      { path: "tenant-requests", element: <TenantRequests /> },
      { path: "complaints", element: <ComplaintsOwner /> },
      { path: "settings", element: <Settings /> },
      { path: "add-pg", element: <CreatePG /> },
    ],
  },

  {
    path: "/tenant",
    element: (
      <ProtectedRoutes Roles={["tenant"]}>
        <TenantNavbar />
      </ProtectedRoutes>
    ),
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
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default AppRouter;
