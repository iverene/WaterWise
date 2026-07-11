import { FiChevronDown, FiDroplet } from "react-icons/fi";

export default function Header({
  activeRole,
  notificationSlot,
  onRoleChange,
  roles = [],
  subtitle = "Sucol Water System",
  title = "WaterWise",
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#0F172A] text-white">
            <FiDroplet aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold tracking-[-0.02em] text-[#0F172A]">
              {title}
            </h1>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center">
          {notificationSlot}
        </div>
      </div>
    </header>
  );
}
