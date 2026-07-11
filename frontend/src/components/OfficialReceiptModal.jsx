import { FiDownload, FiX } from "react-icons/fi";
import { downloadReceiptImage } from "../utils/downloadReceiptImage";

function ReceiptRow({ label, testId, value }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-3 pr-4 text-sm font-semibold text-slate-500">{label}</td>
      <td className="py-3 text-right font-mono text-sm font-bold text-[#0F172A]" data-testid={testId}>
        {value}
      </td>
    </tr>
  );
}

export default function OfficialReceiptModal({ isOpen, receiptData, onClose }) {
  if (!isOpen || !receiptData) return null;

  const {
    meterName,
    runDate,
    previousReading,
    presentReading,
    baselineBill,
    arrears30Days = 0,
    arrears60Days = 0,
    arrears90Days = 0,
  } = receiptData;

  const cubicMetersUsed = presentReading - previousReading;
  const totalArrears = arrears30Days + arrears60Days + arrears90Days;
  const finalTotalBill = baselineBill + totalArrears;

  const handleDownload = () => {
    downloadReceiptImage({
      filename: `${meterName}-official-receipt.png`,
      title: "Official Receipt",
      lines: [
        ["Meter Name", meterName],
        ["Run Date", runDate],
        ["Previous Reading", `${previousReading} m³`],
        ["Present Reading", `${presentReading} m³`],
        ["Cubic Meters Used", `${cubicMetersUsed} m³`],
        ["Baseline Water Bill", `₱${baselineBill.toFixed(2)}`],
        ["Over 30 Days", `₱${arrears30Days.toFixed(2)}`],
        ["Over 60 Days", `₱${arrears60Days.toFixed(2)}`],
        ["Over 90 Days", `₱${arrears90Days.toFixed(2)}`],
        ["Total Bill Sum", `₱${finalTotalBill.toFixed(2)}`],
      ],
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/35 px-4 py-6"
      data-testid="receipt-modal"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
              Sucol Water System
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
              Sucol Water System Official Receipt
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              className="flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-bold text-[#0284C7] transition hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
              data-testid="download-official-receipt-image"
              onClick={handleDownload}
              type="button"
            >
              <FiDownload aria-hidden="true" className="h-4 w-4" />
              Download
            </button>
            <button
              aria-label="Close official receipt"
              className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-slate-200 bg-white text-[#0284C7] transition hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
              data-testid="close-modal"
              onClick={onClose}
              type="button"
            >
              <FiX aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[8px] bg-[#F8FAFC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Meter name
            </p>
            <div className="mt-1 font-bold text-[#0F172A]" data-testid="receipt-meter-name">
              {meterName}
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Run date
            </p>
            <div className="mt-1 font-mono text-sm font-bold text-[#0F172A]" data-testid="receipt-run-date">
              {runDate}
            </div>
          </div>

          <div>
            <table className="w-full border-collapse">
              <tbody>
                <ReceiptRow label="Previous Reading:" testId="telemetry-prev" value={`${previousReading} m³`} />
                <ReceiptRow label="Present Reading:" testId="telemetry-pres" value={`${presentReading} m³`} />
                <ReceiptRow label="Cubic Meters Used:" testId="telemetry-used" value={`${cubicMetersUsed} m³`} />
                <ReceiptRow label="Baseline Water Bill:" testId="telemetry-baseline" value={`₱${baselineBill.toFixed(2)}`} />
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="grid gap-3 rounded-[8px] bg-[#F8FAFC] p-4 sm:grid-cols-3" data-testid="arrears-matrix">
            <span className="font-mono text-sm font-bold text-[#0F172A]" data-testid="arrears-30">
              Over 30 Days: ₱{arrears30Days.toFixed(2)}
            </span>
            <span className="font-mono text-sm font-bold text-[#0F172A]" data-testid="arrears-60">
              Over 60 Days: ₱{arrears60Days.toFixed(2)}
            </span>
            <span className="font-mono text-sm font-bold text-[#0F172A]" data-testid="arrears-90">
              Over 90 Days: ₱{arrears90Days.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[8px] border border-slate-200 p-4">
            <strong className="text-sm font-bold text-[#0F172A]">Total Bill Sum:</strong>
            <span className="font-mono text-xl font-bold text-[#DC2626]" data-testid="receipt-final-total">
              ₱{finalTotalBill.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
