import React, { useEffect, useState } from "react";
import {
  MdAttachMoney,
  MdAccountBalanceWallet,
  MdContentCopy,
} from "react-icons/md";
import { paymentAPI, pgAPI } from "../../services/api";
import { UPIQRCode } from "../../components/UPIQRCode";

export const RentDetails = () => {
  const [rentData, setRentData] = useState({
    totalRent: 0,
    dueDate: "",
    status: "Unpaid",
    upiId: "",
    pgName: "",
    ownerName: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    fetchRentDetails();
  }, []);

  const fetchRentDetails = async () => {
    try {
      setLoading(true);
      setError("");
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
      let upiId = "";
      let pgName = "";
      let ownerName = "";
      let paymentMethod = "";

      if (currentPayment) {
        rent = currentPayment.amount;
        upiId = currentPayment.pgId?.upiId || "";
        pgName = currentPayment.pgId?.pgName || "";
        ownerName = currentPayment.pgId?.ownerId?.fullName || currentPayment.pgId?.pgName || "";
        paymentMethod = currentPayment.paymentMethod || "";
      } else {
        const pgRes = await pgAPI.getPGs();
        const pg = pgRes.data.data[0];
        rent = pg?.rentPerBed || 0;
        upiId = pg?.upiId || "";
        pgName = pg?.pgName || "";
        ownerName = pg?.ownerId?.fullName || pg?.pgName || "";
      }

      const dueDate = `10 ${currentMonth} ${currentYear}`;
      const status = currentPayment ? (currentPayment.status === "success" ? "Paid" : "Pending") : "Unpaid";

      setRentData({
        totalRent: rent,
        dueDate,
        status,
        paymentMethod,
        upiId,
        pgName,
        ownerName,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load rent details.");
    }
    finally {
      setLoading(false);
    }
  };

  const getPgId = async () => {
    const res = await pgAPI.getPGs();
    return res.data.data[0]?._id;
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus(""), 1500);
    } catch (error) {
      console.warn("Clipboard copy failed", error);
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 1500);
    }
  };

  const handleUPI = () => {
    setShowUPIModal(true);
  };

  const performUpiPayment = async () => {
    try {
      setProcessing(true);
      const pgId = await getPgId();

      await paymentAPI.confirmUpiPayment({
        amount: rentData.totalRent,
        pgId,
      });

      await fetchRentDetails();
      setShowUPIModal(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleCash = async () => {
    try {
      setProcessing(true);
      const pgId = await getPgId();

      await paymentAPI.confirmCashPayment({
        amount: rentData.totalRent,
        pgId,
      });

      await fetchRentDetails();
    } catch (err) {
      console.error(err);
      alert("Cash payment failed");
    } finally {
      setProcessing(false);
    }
  };



  const paymentDisabled = rentData.status === "Paid" || rentData.status === "Pending" || rentData.totalRent <= 0;

  const statusLabel = rentData.status === "Paid"
    ? rentData.paymentMethod === "cash"
      ? "Paid in Cash"
      : "Paid"
    : rentData.status === "Pending"
      ? rentData.paymentMethod === "cash"
        ? "Cash pending"
        : "Pending"
      : "Unpaid";

  if (loading) {
    return <div className="p-6 text-center dark:text-white">Loading rent details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-400 dark:text-red-300">{error}</div>;
  }

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rent Details</h1>
            <p className="mt-2 text-gray-400 max-w-2xl">
              Pay rent securely and view the payment scanner or UPI details supplied by your owner.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-800 p-4 text-center shadow-sm border border-slate-700">
              <div className="text-sm text-slate-400">Total</div>
              <div className="mt-2 text-2xl font-semibold">₹{rentData.totalRent}</div>
            </div>
            <div className="rounded-3xl bg-slate-800 p-4 text-center shadow-sm border border-slate-700">
              <div className="text-sm text-slate-400">Due Date</div>
              <div className="mt-2 text-lg font-semibold">{rentData.dueDate}</div>
            </div>
            <div className="rounded-3xl bg-slate-800 p-4 text-center shadow-sm border border-slate-700">
              <div className="text-sm text-slate-400">Status</div>
              <div className={`mt-2 text-lg font-semibold ${rentData.status === "Paid" ? "text-emerald-400" : "text-rose-400"}`}>
                {statusLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl bg-slate-800 p-8 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-400">PG</p>
                <h2 className="text-2xl font-semibold">{rentData.pgName || "Your PG"}</h2>
              </div>
              <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200">
                Rent details
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900 p-5 border border-slate-700">
                <p className="text-sm text-slate-400">Amount due</p>
                <p className="mt-3 text-3xl font-bold">₹{rentData.totalRent}</p>
              </div>
              <div className="rounded-3xl bg-slate-900 p-5 border border-slate-700">
                <p className="text-sm text-slate-400">Due on</p>
                <p className="mt-3 text-2xl font-semibold">{rentData.dueDate}</p>
              </div>
            </div>

            <UPIQRCode upiId={rentData.upiId} payeeName={rentData.ownerName || rentData.pgName} />
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-semibold">Choose payment method</h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Select the safest option for your rent.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={handleUPI}
                  disabled={paymentDisabled}
                  className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
                >
                  <MdAccountBalanceWallet className="h-6 w-6 text-emerald-500" />
                  <div>
                    <div className="font-semibold">UPI</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Use your UPI app and scan the owner QR.</div>
                  </div>
                </button>
                <button
                  onClick={handleCash}
                  disabled={paymentDisabled}
                  className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-left shadow-sm transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900"
                >
                  <MdAttachMoney className="h-6 w-6 text-amber-500" />
                  <div>
                    <div className="font-semibold">Cash</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">Confirm cash payment once you pay the owner.</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Quick payment notes</h3>
              <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                <li>• Scan the owner QR code in your UPI app to pay rent.</li>
                <li>• If UPI is unavailable, copy the owner UPI ID from the details panel.</li>
                <li>• Cash payments remain unpaid until the owner confirms them.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showUPIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-slate-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-semibold">Pay via UPI</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Complete your rent payment using UPI scan or ID.
                </p>
              </div>
              <button onClick={() => setShowUPIModal(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">Close</button>
            </div>

            <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Scan the QR code below in your UPI app</p>
            </div>

            <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] mb-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-gray-700 dark:bg-gray-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Owner UPI ID</p>
                <p className="mt-2 font-mono text-sm text-slate-900 dark:text-slate-100">
                  {rentData.upiId || "Not provided"}
                </p>
                {rentData.upiId && (
                  <button
                    onClick={() => copyText(rentData.upiId)}
                    className="mt-4 inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                  >
                    <MdContentCopy /> Copy UPI ID
                  </button>
                )}
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-gray-700 dark:bg-gray-800">
                <UPIQRCode upiId={rentData.upiId} payeeName={rentData.ownerName || rentData.pgName} />
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={performUpiPayment}
                disabled={processing || !rentData.upiId}
                className="flex-1 rounded-3xl bg-emerald-500 px-5 py-3 text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? "Processing..." : "Confirm UPI Payment"}
              </button>
              <button
                onClick={() => setShowUPIModal(false)}
                className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700 transition hover:border-slate-300 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
