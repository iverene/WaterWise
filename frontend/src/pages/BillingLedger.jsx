import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import BillingHistoryTable from "../components/BillingHistoryTable";
import CurrentBillingCard from "../components/CurrentBillingCard";
import DigitalReceiptModal from "../components/DigitalReceiptModal";
import OfficialReceiptModal from "../components/OfficialReceiptModal";

const defaultLedgerAccount = {
  accountId: "ACC-3022",
  name: "Iverene Grace M. Causapin",
  outstandingBalance: 450,
  dueDate: "July 25, 2026",
};

const billingHistory = [
  {
    invoiceNumber: "INV-2026-006",
    name: defaultLedgerAccount.name,
    billingPeriod: "June 2026",
    readingDate: "2026-06-30",
    cubicMetersConsumed: 24.5,
    amountDue: 450,
    status: "Overdue",
    address: "Purok 4, House 12-B",
    previousReading: 184.2,
    currentReading: 208.7,
  },
  {
    invoiceNumber: "INV-2026-005",
    name: defaultLedgerAccount.name,
    billingPeriod: "May 2026",
    readingDate: "2026-05-31",
    cubicMetersConsumed: 22.1,
    amountDue: 390,
    status: "Paid",
    address: "Purok 4, House 12-B",
    previousReading: 162.1,
    currentReading: 184.2,
  },
  {
    invoiceNumber: "INV-2026-004",
    name: defaultLedgerAccount.name,
    billingPeriod: "April 2026",
    readingDate: "2026-04-30",
    cubicMetersConsumed: 21.4,
    amountDue: 370,
    status: "Paid",
    address: "Purok 4, House 12-B",
    previousReading: 140.7,
    currentReading: 162.1,
  },
];

const defaultOfficialReceipt = {
  meterName: "SWS-MTR-0412",
  runDate: "June 30, 2026",
  previousReading: 184.2,
  presentReading: 208.7,
  baselineBill: 450,
  arrears30Days: 0,
  arrears60Days: 0,
  arrears90Days: 0,
};

export default function BillingLedger({
  historyData = billingHistory,
  ledgerAccount = defaultLedgerAccount,
  officialReceipt = defaultOfficialReceipt,
}) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isOfficialReceiptOpen = searchParams.get("receipt") === "official";

  const handleSelectReceipt = (receipt) => {
    if (receipt.status !== "Paid") {
      setSelectedReceipt(null);
      return;
    }

    setSelectedReceipt(receipt);
  };
  const openOfficialReceipt = () => {
    navigate("/consumer/billing-ledger?receipt=official");
  };
  const closeOfficialReceipt = () => {
    navigate("/consumer/billing-ledger", { replace: true });
  };

  return (
    <div className="space-y-6">

      <CurrentBillingCard
        dueDate={ledgerAccount.dueDate}
        outstandingBalance={ledgerAccount.outstandingBalance}
      />

      <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
              Billing records
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-[#0F172A]">
              Billing History
            </h3>
          </div>
          <button
            className="w-full rounded-[8px] bg-[#0284C7] px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 sm:w-auto"
            onClick={openOfficialReceipt}
            type="button"
          >
            View Official Receipt
          </button>
        </div>

        <BillingHistoryTable
          historyData={historyData}
          onSelectReceipt={handleSelectReceipt}
        />
      </section>

      <DigitalReceiptModal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        receiptData={selectedReceipt}
      />

      <OfficialReceiptModal
        isOpen={isOfficialReceiptOpen}
        onClose={closeOfficialReceipt}
        receiptData={officialReceipt}
      />
    </div>
  );
}
