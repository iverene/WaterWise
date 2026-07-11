export default function ConsumerInfoGrid({ name, purok, houseNumber }) {
  return (
    <section className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-[0_18px_56px_rgba(15,23,42,0.05)]">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
        Consumer Information
      </h3>
      <div className="space-y-4">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Full Name</span>
          <span className="mt-1 block text-base font-bold tracking-[-0.02em] text-[#0F172A]" data-testid="info-name">
            {name || 'N/A'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Purok</span>
            <span className="mt-1 block text-base font-bold text-[#0F172A]" data-testid="info-purok">
              {purok || 'N/A'}
            </span>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">House No.</span>
            <span className="mt-1 block text-base font-bold text-[#0F172A]" data-testid="info-house">
              {houseNumber || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
