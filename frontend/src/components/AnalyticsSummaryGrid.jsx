import CurrentBalanceCard from "./CurrentBalanceCard";

const summaryCards = [
  { key: "total", label: "Total Consumption", testId: "stat-total" },
  { key: "average", label: "Average Monthly Usage", testId: "stat-avg" },
  { key: "highest", label: "Highest Consumption Month", testId: "stat-highest" },
];

export default function AnalyticsSummaryGrid({ amountDue = 0, consumptionHistory = [] }) {
  if (consumptionHistory.length === 0) {
    return (
      <div
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
        data-testid="analytics-empty"
      >
        <CurrentBalanceCard amountDue={amountDue} />
        <SummaryCard label="Total Consumption" testId="stat-total" value="0 m³" />
        <SummaryCard label="Average Monthly Usage" testId="stat-avg" value="0 m³" />
        <SummaryCard label="Highest Consumption Month" testId="stat-highest" value="None" />
      </div>
    );
  }

  const totalConsumption = consumptionHistory.reduce((acc, curr) => acc + curr.volume, 0);
  const averageUsage = totalConsumption / consumptionHistory.length;

  const highestRecord = consumptionHistory.reduce((max, current) =>
    current.volume > max.volume ? current : max,
    consumptionHistory[0],
  );

  const values = {
    total: `${totalConsumption.toLocaleString("en-US", { maximumFractionDigits: 1 })} m³`,
    average: `${averageUsage.toLocaleString("en-US", { maximumFractionDigits: 1 })} m³`,
    highest: highestRecord.month,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" data-testid="analytics-grid">
      <CurrentBalanceCard amountDue={amountDue} />
      {summaryCards.map((card) => (
        <SummaryCard
          key={card.key}
          label={card.label}
          testId={card.testId}
          value={values[card.key]}
        />
      ))}
    </div>
  );
}

function SummaryCard({ label, testId, value }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
        {label}
      </span>
      <h3
        className="mt-3 font-mono text-2xl font-bold tracking-normal text-[#0F172A]"
        data-testid={testId}
      >
        {value}
      </h3>
    </section>
  );
}
