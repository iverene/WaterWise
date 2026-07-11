export default function CurrentBalanceCard({ amountDue = 0 }) {
  const isOverdue = amountDue > 0;

  return (
    <section className="flex flex-col justify-between rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
          Current Balance
        </h3>
        <p className="text-sm text-slate-600">Outstanding balance totals</p>
      </div>
      <div className="mt-4">
        <span
          className={`font-mono text-3xl font-bold tracking-normal ${
            isOverdue
              ? "text-red-600 text-[#DC2626]"
              : "text-gray-600 text-slate-600"
          }`}
          data-testid="balance-amount"
        >
          ₱
          {amountDue.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          })}
        </span>
        <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          Active Amount Due
        </span>
      </div>
    </section>
  );
}
