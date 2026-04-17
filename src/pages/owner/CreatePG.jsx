import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { pgAPI } from "../../services/api";

export const CreatePG = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [currentAmenity, setCurrentAmenity] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addAmenity = () => {
    if (currentAmenity.trim() && !amenities.includes(currentAmenity.trim())) {
      setAmenities([...amenities, currentAmenity.trim()]);
      setCurrentAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter((amenity) => amenity !== amenityToRemove));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const pgData = {
        ...data,
        amenities,
        totalRooms: parseInt(data.totalRooms),
        totalBeds: parseInt(data.totalBeds),
        rentPerBed: parseFloat(data.rentPerBed),
        status: "pending",
      };

      await pgAPI.createPG(pgData);
      toast.success(
        "PG registration request submitted! Please wait for admin approval.",
      );
      navigate("/owner/dashboard");
    } catch (error) {
      console.error("Error creating PG:", error);
      toast.error("Failed to submit PG registration request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              Register Your PG
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Fill in the details below. Your request will be reviewed by an
              admin.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 dark:shadow-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* PG Name */}
            <div>
              <label
                htmlFor="pgName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                PG Name *
              </label>
              <div className="mt-1">
                <input
                  id="pgName"
                  type="text"
                  {...register("pgName", { required: "PG Name is required" })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.pgName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.pgName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Owner Name */}
            <div>
              <label
                htmlFor="ownerName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Owner Name *
              </label>
              <div className="mt-1">
                <input
                  id="ownerName"
                  type="text"
                  {...register("ownerName", {
                    required: "Owner Name is required",
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter owner name"
                />
                {errors.ownerName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Address *
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  rows={3}
                  {...register("address", { required: "Address is required" })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {/* City */}
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                City *
              </label>
              <div className="mt-1">
                <input
                  id="city"
                  type="text"
                  {...register("city", { required: "City is required" })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                State *
              </label>
              <div className="mt-1">
                <input
                  id="state"
                  type="text"
                  {...register("state", { required: "State is required" })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label
                htmlFor="pincode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Pincode *
              </label>
              <div className="mt-1">
                <input
                  id="pincode"
                  type="text"
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Pincode must be 6 digits",
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter 6-digit pincode"
                />
                {errors.pincode && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Contact Number *
              </label>
              <div className="mt-1">
                <input
                  id="contactNumber"
                  type="tel"
                  {...register("contactNumber", {
                    required: "Contact Number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Contact number must be 10 digits",
                    },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter 10-digit contact number"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
            </div>

            {/* Total Rooms */}
            <div>
              <label
                htmlFor="totalRooms"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Total Rooms *
              </label>
              <div className="mt-1">
                <input
                  id="totalRooms"
                  type="number"
                  min="1"
                  {...register("totalRooms", {
                    required: "Total Rooms is required",
                    min: { value: 1, message: "At least 1 room required" },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter total number of rooms"
                />
                {errors.totalRooms && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.totalRooms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Total Beds */}
            <div>
              <label
                htmlFor="totalBeds"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Total Beds *
              </label>
              <div className="mt-1">
                <input
                  id="totalBeds"
                  type="number"
                  min="1"
                  {...register("totalBeds", {
                    required: "Total Beds is required",
                    min: { value: 1, message: "At least 1 bed required" },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter total number of beds"
                />
                {errors.totalBeds && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.totalBeds.message}
                  </p>
                )}
              </div>
            </div>

            {/* Rent Per Bed */}
            <div>
              <label
                htmlFor="rentPerBed"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Rent Per Bed (₹) *
              </label>
              <div className="mt-1">
                <input
                  id="rentPerBed"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("rentPerBed", {
                    required: "Rent Per Bed is required",
                    min: { value: 0, message: "Rent cannot be negative" },
                  })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter rent per bed"
                />
                {errors.rentPerBed && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.rentPerBed.message}
                  </p>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amenities
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={currentAmenity}
                  onChange={(e) => setCurrentAmenity(e.target.value)}
                  // onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Add amenity (e.g., WiFi, AC, Laundry)"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
              {amenities.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="ml-1 inline-flex items-center p-0.5 rounded-full text-blue-400 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 hover:text-blue-500 dark:hover:text-blue-100"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe your PG facilities, rules, etc."
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Registration Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
