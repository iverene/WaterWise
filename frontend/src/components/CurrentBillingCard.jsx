import { FiCalendar, FiFileText } from "react-icons/fi";

export default function CurrentBillingCard({ outstandingBalance = 0, dueDate = "" }) {
  return (
    <section
      className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]"
      data-testid="current-billing-card"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FiFileText aria-hidden="true" className="h-4 w-4 text-[#0284C7]" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
              Outstanding Balance
            </span>
          </div>
          <h2
            className="mt-3 font-mono text-4xl font-bold tracking-normal text-[#DC2626]"
            data-testid="outstanding-balance"
          >
            ₱{outstandingBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="rounded-[8px] border border-slate-200 bg-[#F8FAFC] p-4 sm:min-w-56">
          <div className="flex items-center gap-2">
            <FiCalendar aria-hidden="true" className="h-4 w-4 text-[#0284C7]" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Upcoming Due Date
            </span>
          </div>
          <p
            className="mt-2 text-base font-bold tracking-[-0.02em] text-[#0F172A]"
            data-testid="due-date"
          >
            {dueDate || "No pending due date"}
          </p>
        </div>
      </div>
    </section>
  );
}
