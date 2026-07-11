import NotificationCard from '../components/NotificationCard';

export default function NotificationPage({
  notifications = [],
  onMarkAsRead,
  onNotificationClick,
}) {
  const accountBills = notifications.filter(item => item.category === 'bill');
  const adminAnnouncements = notifications.filter(item => item.category === 'announcement');

  return (
    <div data-testid="notification-hub-page" className="h-full overflow-y-auto p-5">
      <h3 className="text-lg font-bold tracking-[-0.02em] text-[#0F172A]">
        Notifications
      </h3>
      
      <div className="mt-5 grid grid-cols-1 gap-4">
        <section data-testid="section-bills" className="rounded-[8px] border border-slate-200 bg-white p-4">
          <h4 className="border-b border-slate-200 pb-2 text-sm font-bold text-[#0284C7]">Account Bills</h4>
          {accountBills.length === 0 ? (
            <p data-testid="empty-bills" className="mt-3 text-sm text-slate-500">No billing notifications.</p>
          ) : (
            accountBills.map(bill => (
              <NotificationCard 
                key={bill.id} 
                item={bill} 
                onMarkAsRead={onMarkAsRead} 
                onNotificationClick={onNotificationClick}
              />
            ))
          )}
        </section>

        <section data-testid="section-announcements" className="rounded-[8px] border border-slate-200 bg-white p-4">
          <h4 className="border-b border-slate-200 pb-2 text-sm font-bold text-[#16A34A]">Administrative Announcements</h4>
          {adminAnnouncements.length === 0 ? (
            <p data-testid="empty-announcements" className="mt-3 text-sm text-slate-500">No administrative announcements.</p>
          ) : (
            adminAnnouncements.map(announcement => (
              <NotificationCard 
                key={announcement.id} 
                item={announcement} 
                onMarkAsRead={onMarkAsRead} 
                onNotificationClick={onNotificationClick}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
