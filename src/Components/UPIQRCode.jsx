import React, { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

export const UPIQRCode = ({ upiId, payeeName, label = "upi", size = 220, className = "" }) => {
  const encodedPayeeName = useMemo(() => encodeURIComponent(payeeName || ""), [payeeName]);
  const qrValue = useMemo(() => {
    if (!upiId) return "";
    const encodedUpiId = encodeURIComponent(upiId);
    return `upi://pay?pa=${encodedUpiId}&pn=${encodedPayeeName}&cu=INR`;
  }, [upiId, encodedPayeeName]);

  const downloadQRCode = () => {
    const canvas = document.getElementById(`qr-canvas-${label}`);
    if (!canvas) {
      toast.error("QR code not ready for download");
      return;
    }

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${label.replace(/\s+/g, "_") || "upi_qr"}.png`;
    link.click();
  };

  const copyUpiId = async () => {
    if (!upiId) {
      toast.error("No UPI ID to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(upiId);
      toast.success("UPI ID copied");
    } catch (err) {
      console.error(err);
      toast.error("Copy failed");
    }
  };

  if (!upiId) {
    return (
      <div className={`rounded-3xl border border-dashed border-slate-500 bg-slate-800 p-6 text-center text-slate-400 ${className}`}>
        <p className="text-base font-medium">No payment QR available</p>
        <p className="mt-2 text-sm text-slate-500">Please add a UPI ID to generate a scannable QR code.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-slate-700 bg-slate-900 p-5 text-slate-100 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Scan this QR in any UPI app</p>
          <p className="mt-1 text-base font-semibold text-slate-100 break-all">{upiId}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-3 text-center">
        <QRCodeCanvas
          id={`qr-canvas-${label}`}
          value={qrValue}
          size={size}
          bgColor="#ffffff"
          fgColor="#0f172a"
          level="M"
          includeMargin={true}
        />
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-300">
        <p className="break-words">{qrValue}</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyUpiId}
          className="inline-flex min-w-[140px] items-center justify-center rounded-3xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 ring-1 ring-slate-600 transition hover:bg-slate-700"
        >
          Copy UPI ID
        </button>
        <button
          type="button"
          onClick={downloadQRCode}
          className="inline-flex min-w-[140px] items-center justify-center rounded-3xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Download QR
        </button>
      </div>
    </div>
  );
};
