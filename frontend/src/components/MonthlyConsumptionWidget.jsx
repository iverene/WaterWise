export default function MonthlyConsumptionWidget({ month = "N/A", usage = 0 }) {
  return (
    <section className="flex flex-col justify-between rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
          Monthly Consumption
        </h3>
        <p className="text-sm text-slate-600">Latest volume metrics</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Billing Period
          </span>
          <span
            className="mt-1 block text-sm font-bold text-[#0F172A]"
            data-testid="consumption-month"
          >
            {month}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Usage
          </span>
          <span
            className="mt-1 block font-mono text-lg font-bold tracking-normal text-[#0284C7]"
            data-testid="consumption-usage"
          >
            {usage} m³
          </span>
        </div>
      </div>
    </section>
  );
}
