import { useCallback, useEffect, useState } from "react";
import AnalyticsSummaryGrid from "../components/AnalyticsSummaryGrid";
import ConsumptionTrendGraph from "../components/ConsumptionTrendGraph";
import { fetchConsumptionHistory } from "../services/consumptionHistory.service";

export default function UsageMetrics({
  amountDue = 0,
  usageHistory,
}) {
  const usesApi = usageHistory === undefined;
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(usesApi);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setIsLoading(true);
    setError("");
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    if (!usesApi) {
      return undefined;
    }

    const controller = new AbortController();

    fetchConsumptionHistory({ signal: controller.signal })
      .then(setHistory)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setHistory([]);
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [requestVersion, usageHistory, usesApi]);

  const displayedHistory = usesApi ? history : usageHistory;

  return (
    <div className="space-y-6">
      {isLoading && (
        <div
          className="rounded-[8px] border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800"
          role="status"
        >
          Loading your consumption history…
        </div>
      )}

      {error && (
        <div
          className="flex flex-col gap-3 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <span>{error}</span>
          <button
            className="rounded-[6px] bg-red-700 px-4 py-2 font-bold text-white hover:bg-red-800"
            onClick={retry}
            type="button"
          >
            Try again
          </button>
        </div>
      )}

      <AnalyticsSummaryGrid amountDue={amountDue} consumptionHistory={displayedHistory} />

      <ConsumptionTrendGraph trendData={displayedHistory} />
    </div>
  );
}
