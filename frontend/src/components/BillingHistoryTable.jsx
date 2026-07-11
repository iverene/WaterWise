function getStatusClass(status) {
  if (status === "Paid") {
    return "bg-emerald-50 text-[#16A34A]";
  }

  return "bg-red-50 text-[#DC2626]";
}

export default function BillingHistoryTable({ historyData = [], onSelectReceipt }) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-slate-200 bg-white">
      <table
        className="w-full min-w-[760px] border-collapse text-left text-sm"
        data-testid="billing-history-table"
      >
        <thead>
          <tr className="border-b border-slate-200 bg-[#F8FAFC] text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            <th className="px-4 py-3">Billing Period</th>
            <th className="px-4 py-3">Reading Date</th>
            <th className="px-4 py-3">Consumption</th>
            <th className="px-4 py-3">Amount Due</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {historyData.map((row) => {
            const canViewReceipt = row.status === "Paid";

            return (
              <tr
                className="text-[#0F172A] transition hover:bg-[#F8FAFC]"
                data-testid="history-row"
                key={row.invoiceNumber}
              >
                <td className="px-4 py-4 font-bold" data-testid="row-month">
                  {row.billingPeriod}
                </td>
                <td
                  className="px-4 py-4 font-mono text-slate-600"
                  data-testid="row-reading-date"
                >
                  {row.readingDate}
                </td>
                <td className="px-4 py-4 font-mono" data-testid="row-consumption">
                  {row.cubicMetersConsumed} m³
                </td>
                <td className="px-4 py-4 font-mono" data-testid="row-amount-due">
                  ₱{row.amountDue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-[6px] px-2.5 py-1 text-xs font-bold ${getStatusClass(row.status)}`}
                    data-status={row.status}
                    data-testid="row-status"
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    className={[
                      "rounded-[6px] border border-slate-200 px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2",
                      canViewReceipt
                        ? "bg-white text-[#0284C7] hover:bg-[#F8FAFC]"
                        : "cursor-not-allowed bg-slate-100 text-slate-400",
                    ].join(" ")}
                    data-testid={`view-receipt-${row.invoiceNumber}`}
                    disabled={!canViewReceipt}
                    onClick={() => canViewReceipt && onSelectReceipt && onSelectReceipt(row)}
                    type="button"
                  >
                    {canViewReceipt ? "View Receipt" : "Unavailable"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
