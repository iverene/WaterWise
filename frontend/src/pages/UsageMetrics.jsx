import AnalyticsSummaryGrid from "../components/AnalyticsSummaryGrid";
import ConsumptionTrendGraph from "../components/ConsumptionTrendGraph";

const defaultUsageHistory = [
  { month: "January 2026", volume: 18.2 },
  { month: "February 2026", volume: 19.6 },
  { month: "March 2026", volume: 21.3 },
  { month: "April 2026", volume: 21.4 },
  { month: "May 2026", volume: 22.1 },
  { month: "June 2026", volume: 24.5 },
];

export default function UsageMetrics({
  amountDue = 0,
  usageHistory = defaultUsageHistory,
}) {
  return (
    <div className="space-y-6">

      <AnalyticsSummaryGrid amountDue={amountDue} consumptionHistory={usageHistory} />

      <ConsumptionTrendGraph trendData={usageHistory} />
    </div>
  );
}
