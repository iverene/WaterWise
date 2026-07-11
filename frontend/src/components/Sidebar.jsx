import { FiLogOut, FiUser } from "react-icons/fi";
import { NavLink } from "react-router";

function getItemLabel(item) {
  return typeof item === "string" ? item : item.label;
}

export default function Sidebar({
  activeRoleLabel,
  items = [],
  onLogout,
  userName = "WaterWise User",
}) {
  return (
    <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col p-4 sm:p-6">
        <nav aria-label={`${activeRoleLabel ?? "WaterWise"} navigation`}>
          <ul className="grid gap-1">
            {items.map((item) => {
              const label = getItemLabel(item);
              const Icon = typeof item === "string" ? null : item.Icon;

              return (
                <li key={label}>
                  {typeof item === "string" || !item.path ? (
                    <span className="flex min-h-11 items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-semibold text-slate-600">
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-[#0284C7]"
                        />
                      )}
                      {label}
                    </span>
                  ) : (
                    <NavLink
                      className={({ isActive }) =>
                        [
                          "flex min-h-11 items-center gap-3 rounded-[8px] px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2",
                          isActive
                            ? "bg-[#0F172A] text-white"
                            : "text-slate-600 hover:bg-[#F8FAFC] hover:text-[#0F172A]",
                        ].join(" ")
                      }
                      to={item.path}
                    >
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0"
                        />
                      )}
                      <span>{label}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 border-t border-slate-200 pt-4 lg:mt-auto">
          <div className="flex items-center gap-3 rounded-[8px] bg-[#F8FAFC] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-white text-[#0284C7]">
              <FiUser aria-hidden="true" className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold tracking-[-0.02em] text-[#0F172A]">
                {userName}
              </p>
              {activeRoleLabel && (
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0284C7]">
                  {activeRoleLabel}
                </p>
              )}
            </div>
            <button
              aria-label="Log out"
              className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-slate-200 bg-white text-slate-500 transition hover:border-[#DC2626]/30 hover:bg-red-50 hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
              onClick={onLogout}
              type="button"
            >
              <FiLogOut aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
