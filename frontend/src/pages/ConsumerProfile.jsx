import { useEffect, useState } from "react";
import {
  FiDroplet,
  FiFileText,
  FiHome,
  FiMail,
  FiPhone,
  FiShield,
} from "react-icons/fi";
import ConsumerInfoGrid from "../components/ConsumerInfoGrid";
import CurrentBalanceCard from "../components/CurrentBalanceCard";
import MonthlyConsumptionWidget from "../components/MonthlyConsumptionWidget";
import { fetchConsumerProfile } from "../services/consumerPortal.service";

function DetailItem({ Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-[8px] border border-slate-200 bg-[#F8FAFC] p-4">
      <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0284C7]" />
      <div className="min-w-0">
        <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </dt>
        <dd className="mt-1 break-words text-sm font-bold text-[#0F172A]">
          {value}
        </dd>
      </div>
    </div>
  );
}

export default function ConsumerProfile({ consumer: consumerProp }) {
  const usesApi = consumerProp === undefined;
  const [loadedConsumer, setLoadedConsumer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!usesApi) return undefined;

    const controller = new AbortController();
    fetchConsumerProfile({ signal: controller.signal })
      .then(setLoadedConsumer)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      });

    return () => controller.abort();
  }, [usesApi]);

  const consumer = usesApi ? loadedConsumer : consumerProp;

  if (error) {
    return <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-red-800" role="alert">{error}</div>;
  }

  if (!consumer) {
    return <div className="rounded-[8px] border border-sky-100 bg-sky-50 p-4 text-sky-800" role="status">Loading consumer profile…</div>;
  }

  const consumptionDifference = Number(
    (consumer.currentReading - consumer.previousReading).toFixed(1),
  );

  return (
    <div className="space-y-6">
      
      <section className="grid gap-4 lg:grid-cols-3">
        <ConsumerInfoGrid
          houseNumber={consumer.houseNumber}
          name={consumer.name}
          purok={consumer.purok}
        />
        <CurrentBalanceCard amountDue={consumer.activeAmountDue} />
        <MonthlyConsumptionWidget
          month={consumer.latestMonth}
          usage={consumer.volumetricUsage}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
            Account registry
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-[#0F172A]">
            Contact and location
          </h3>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <DetailItem Icon={FiMail} label="Email address" value={consumer.email} />
            <DetailItem Icon={FiPhone} label="Contact number" value={consumer.contactNumber} />
            <DetailItem Icon={FiHome} label="House number" value={consumer.houseNumber} />
            <DetailItem Icon={FiDroplet} label="Meter number" value={consumer.meterNumber} />
          </dl>
        </div>

        <div className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
            Latest reading
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-[#0F172A]">
            Meter snapshot
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[8px] bg-[#F8FAFC] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Previous
              </p>
              <p className="mt-2 font-mono text-xl font-bold text-[#0F172A]">
                {consumer.previousReading.toFixed(1)} m³
              </p>
            </div>
            <div className="rounded-[8px] bg-[#F8FAFC] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Current
              </p>
              <p className="mt-2 font-mono text-xl font-bold text-[#0F172A]">
                {consumer.currentReading.toFixed(1)} m³
              </p>
            </div>
            <div className="rounded-[8px] bg-sky-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
                Consumed
              </p>
              <p className="mt-2 font-mono text-xl font-bold text-[#0284C7]">
                {consumptionDifference.toFixed(1)} m³
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[8px] border border-slate-200 bg-[#F8FAFC] p-4">
            <div className="flex gap-3">
              <FiFileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#0284C7]" />
              <div>
                <p className="text-sm font-bold text-[#0F172A]">
                  Last reading date
                </p>
                <p className="mt-1 font-mono text-sm text-slate-600">
                  {consumer.lastReadingDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[8px] border border-emerald-100 bg-emerald-50 p-5">
        <div className="flex gap-3">
          <FiShield aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]" />
          <div>
            <p className="text-sm font-bold text-[#0F172A]">
              Consumer read-only boundary
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This portal can inspect account data but cannot create, update, or
              delete billing records. Mutation requests remain reserved for
              authorized administrative workflows.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
