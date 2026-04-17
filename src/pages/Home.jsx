import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen">

      {/* NAVBAR */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-blue-600">
          PG Management
        </h1>

        <div className="flex gap-6 font-medium">

          {/* <Link to="/" className="hover:text-blue-600">
            Home
          </Link> */}

          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Sign Up
          </Link>

        </div>

      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-20 bg-white">

        <div className="max-w-xl">

          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Manage Your PG Easily
          </h1>

          <p className="text-gray-600 mb-6">
            Our PG Management System helps owners manage tenants, rent,
            food menus and complaints efficiently in one platform.
          </p>

          <div className="flex gap-4">

            <Link
              to="/signup"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-600 hover:text-white"
            >
              Login
            </Link>

          </div>

        </div>

        {/* HERO IMAGE */}
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
          alt="PG Room"
          className="w-full md:w-[450px] rounded-lg shadow-lg mt-10 md:mt-0"
        />

      </section>

      {/* OUR SERVICES */}
      <section className="py-16 px-10 text-center bg-gray-100">

        <h2 className="text-3xl font-bold mb-10">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Tenant Management
            </h3>
            <p className="text-gray-600">
              Add and manage tenant details easily.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Room & Bed Management
            </h3>
            <p className="text-gray-600">
              Track room availability and occupancy.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Rent Tracking
            </h3>
            <p className="text-gray-600">
              Monitor rent payments and pending dues.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Food Menu Management
            </h3>
            <p className="text-gray-600">
              Update daily food menus for tenants.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Complaint System
            </h3>
            <p className="text-gray-600">
              Tenants can report issues and get quick responses.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold text-lg mb-2">
              Notice Board
            </h3>
            <p className="text-gray-600">
              Share announcements with tenants instantly.
            </p>
          </div>

        </div>

      </section>

      {/* BENEFITS */}
      <section className="py-16 px-10 bg-white text-center">

        <h2 className="text-3xl font-bold mb-10">
          Benefits of Using Our System
        </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Time Saving
            </h3>
            <p className="text-gray-600 text-sm">
              Manage your PG digitally and reduce manual work.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Organized Records
            </h3>
            <p className="text-gray-600 text-sm">
              Store all tenant and payment data in one place.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Easy Communication
            </h3>
            <p className="text-gray-600 text-sm">
              Send notices and updates to tenants easily.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              Better Management
            </h3>
            <p className="text-gray-600 text-sm">
              Improve efficiency in managing PG operations.
            </p>
          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 px-10 bg-gray-100 text-center">

        <h2 className="text-3xl font-bold mb-10">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold mb-2">
              Simple Interface
            </h3>
            <p className="text-gray-600">
              Easy to use dashboard for both owners and tenants.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold mb-2">
              Secure System
            </h3>
            <p className="text-gray-600">
              Protects user data with secure login and storage.
            </p>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="font-semibold mb-2">
              Modern Management
            </h3>
            <p className="text-gray-600">
              Replace manual records with digital management.
            </p>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 text-center">

        <h3 className="text-lg font-semibold">
          PG Management System
        </h3>

        <p className="text-gray-400 mt-2">
          Manage your PG smarter and easier.
        </p>

        <p className="text-gray-500 text-sm mt-4">
          © 2026 PG Management System. All Rights Reserved.
        </p>

      </footer>

    </div>
  );
};