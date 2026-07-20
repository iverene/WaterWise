import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import BillingHistoryTable from "../components/BillingHistoryTable";
import CurrentBillingCard from "../components/CurrentBillingCard";
import DigitalReceiptModal from "../components/DigitalReceiptModal";
import OfficialReceiptModal from "../components/OfficialReceiptModal";
import { fetchBillingLedger } from "../services/consumerPortal.service";

export default function BillingLedger({
  historyData: historyDataProp,
  ledgerAccount: ledgerAccountProp,
  officialReceipt: officialReceiptProp,
}) {
  const usesApi = historyDataProp === undefined;
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isOfficialReceiptOpen = searchParams.get("receipt") === "official";

  useEffect(() => {
    if (!usesApi) return undefined;

    const controller = new AbortController();
    fetchBillingLedger({ signal: controller.signal })
      .then(setLedger)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      });

    return () => controller.abort();
  }, [usesApi]);

  const historyData = usesApi ? ledger?.historyData ?? [] : historyDataProp;
  const ledgerAccount = usesApi ? ledger?.ledgerAccount : ledgerAccountProp;
  const officialReceipt = usesApi ? ledger?.officialReceipt : officialReceiptProp;

  if (error) {
    return <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-red-800" role="alert">{error}</div>;
  }

  if (!ledgerAccount) {
    return <div className="rounded-[8px] border border-sky-100 bg-sky-50 p-4 text-sky-800" role="status">Loading billing ledger…</div>;
  }

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
          {officialReceipt && <button
            className="w-full rounded-[8px] bg-[#0284C7] px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2 sm:w-auto"
            onClick={openOfficialReceipt}
            type="button"
          >
            View Official Receipt
          </button>}
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
