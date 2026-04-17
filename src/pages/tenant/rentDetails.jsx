import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdDateRange,
  MdCheckCircle,
  MdError,
} from "react-icons/md";
import { paymentAPI, pgAPI } from "../../services/api";

export const RentDetails = () => {
  const [rentData, setRentData] = useState({
    totalRent: 0,
    dueDate: "",
    status: "Unpaid",
  });

  useEffect(() => {
    fetchRentDetails();
  }, []);

  // ================= FETCH RENT =================
  const fetchRentDetails = async () => {
    try {
      const paymentRes = await paymentAPI.getTenantPayments();
      const payments = paymentRes.data.data || [];

      const now = new Date();
      const currentMonth = now.toLocaleString("default", {
        month: "long",
      });
      const currentYear = now.getFullYear();

      const currentPayment = payments.find(
        (p) => p.month === currentMonth && p.year === currentYear
      );

      let rent = 0;

      if (currentPayment) {
        rent = currentPayment.amount;
      } else {
        const pgRes = await pgAPI.getPGs();
        const pg = pgRes.data.data[0];
        rent = pg?.rentPerBed || 0;
      }

      const dueDate = `10 ${currentMonth} ${currentYear}`;

      const status =
        currentPayment?.status === "success" ? "Paid" : "Unpaid";

      setRentData({
        totalRent: rent,
        dueDate,
        status,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ================= GET PG ID =================
  const getPgId = async () => {
    const res = await pgAPI.getPGs();
    return res.data.data[0]?._id;
  };

  // ================= UPI =================
  const handleUPI = async () => {
    try {
      const pgId = await getPgId();

      await paymentAPI.confirmUpiPayment({
        amount: rentData.totalRent,
        pgId,
      });

      fetchRentDetails();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCash = async () => {
    try {
      const pgId = await getPgId();

      await paymentAPI.confirmCashPayment({
        amount: rentData.totalRent,
        pgId,
      });

      fetchRentDetails();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= RAZORPAY =================
  const handleRazorpay = async () => {
    try {
      const pgId = await getPgId();

      const now = new Date();
      const currentMonth = now.toLocaleString("default", {
        month: "long",
      });
      const currentYear = now.getFullYear();

      const res = await paymentAPI.createOrder({
        amount: rentData.totalRent,
        month: currentMonth,
        year: currentYear,
        pgId,
      });

      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: "INR",
        name: "PG Rent",
        order_id: res.data.order_id,
        handler: async function (response) {
          await paymentAPI.verifyPayment(response);
          fetchRentDetails();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Rent Details</h1>

      <div className="bg-gray-800 p-6 rounded-lg max-w-md">
        <h2 className="text-xl mb-4">Rent Breakdown</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Total Rent</span>
            <span>₹{rentData.totalRent}</span>
          </div>

          <div className="flex justify-between">
            <span>Due Date</span>
            <span>{rentData.dueDate}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span
              className={
                rentData.status === "Paid"
                  ? "text-green-500"
                  : "text-red-500"
              }
            >
              {rentData.status}
            </span>
          </div>

          {/* ================= PAYMENT BUTTONS ================= */}

          <button
            onClick={handleUPI}
            className="w-full bg-green-600 py-2 rounded mt-4"
          >
            Pay via UPI
          </button>

          <button
            onClick={handleRazorpay}
            className="w-full bg-blue-600 py-2 rounded"
          >
            Pay via Card / NetBanking
          </button>

          <button
            onClick={handleCash}
            className="w-full bg-gray-600 py-2 rounded"
          >
            Mark as Cash Payment
          </button>
        </div>
      </div>
    </div>
  );
};