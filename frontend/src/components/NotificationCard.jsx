import { FiTrash2 } from "react-icons/fi";

export default function NotificationCard({ item, onDelete, onMarkAsRead, onNotificationClick }) {
  if (!item) return null;

  const handleClick = () => {
    if (!item.isRead && onMarkAsRead) {
      onMarkAsRead(item.id);
    }

    onNotificationClick?.(item);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete?.(item.id);
  };

  return (
    <div
      data-testid={`notification-card-${item.id}`}
      data-id={item.id}
      data-is-read={item.isRead}
      
      className={`mb-3 cursor-pointer rounded-[8px] border p-4 transition-colors ${
        item.isRead
          ? 'border-slate-200 bg-slate-50 text-slate-500'
          : 'border-sky-200 bg-sky-50 text-[#0F172A] font-semibold'
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h5>{item.title}</h5>
          <p className="mt-1 text-sm font-normal leading-5">{item.message}</p>
        </div>
        <button
          aria-label={`Delete ${item.title}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] text-slate-400 transition hover:bg-red-50 hover:text-[#DC2626] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
          onClick={handleDelete}
          title="Delete notification"
          type="button"
        >
          <FiTrash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
