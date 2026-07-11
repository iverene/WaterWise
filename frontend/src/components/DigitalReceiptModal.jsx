import { FiDownload, FiX } from "react-icons/fi";
import { downloadReceiptImage } from "../utils/downloadReceiptImage";

function ReceiptLine({ label, testId, value }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-100 py-3 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="font-mono font-bold text-[#0F172A]" data-testid={testId}>
        {value}
      </span>
    </div>
  );
}

export default function DigitalReceiptModal({ isOpen, receiptData, onClose }) {
  if (!isOpen || !receiptData) return null;

  const calculatedDifference = receiptData.currentReading - receiptData.previousReading;

  const handleDownload = () => {
    downloadReceiptImage({
      filename: `${receiptData.invoiceNumber}-digital-receipt.png`,
      title: "Digital Receipt",
      lines: [
        ["Invoice Number", receiptData.invoiceNumber],
        ["Name", receiptData.name],
        ["Previous Reading", `${receiptData.previousReading} m³`],
        ["Current Reading", `${receiptData.currentReading} m³`],
        ["Consumption Difference", `${calculatedDifference} m³`],
        [
          "Total Amount Payable",
          `₱${receiptData.amountDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        ],
      ],
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/35 px-4 py-6"
      data-testid="receipt-modal-overlay"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[8px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
        data-testid="receipt-modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
              Digital receipt
            </p>
            <h3 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-[#0F172A]">
              Billing statement preview
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              className="flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-bold text-[#0284C7] transition hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
              data-testid="download-receipt-image"
              onClick={handleDownload}
              type="button"
            >
              <FiDownload aria-hidden="true" className="h-4 w-4" />
              Download
            </button>
            <button
              aria-label="Close receipt"
              className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-slate-200 bg-white text-[#0284C7] transition hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
              data-testid="close-modal-btn"
              onClick={onClose}
              type="button"
            >
              <FiX aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <ReceiptLine
            label="Invoice Number"
            testId="receipt-invoice"
            value={receiptData.invoiceNumber}
          />
          <ReceiptLine label="Name" testId="receipt-name" value={receiptData.name} />
          <ReceiptLine
            label="Previous Meter Dial Reading"
            testId="receipt-prev-dial"
            value={`${receiptData.previousReading} m³`}
          />
          <ReceiptLine
            label="Current Meter Dial Reading"
            testId="receipt-curr-dial"
            value={`${receiptData.currentReading} m³`}
          />
          <ReceiptLine
            label="Total Consumption Difference"
            testId="receipt-diff"
            value={`${calculatedDifference} m³`}
          />

          <div className="mt-5 rounded-[8px] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between gap-4">
              <strong className="text-sm font-bold text-[#0F172A]">
                Total Amount Payable
              </strong>
              <span
                className="font-mono text-xl font-bold text-[#DC2626]"
                data-testid="receipt-total-payable"
              >
                ₱{receiptData.amountDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
