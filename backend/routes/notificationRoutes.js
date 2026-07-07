import express from 'express';
const router = express.Router();

// --- IN-MEMORY DATABASE STUB ---
let temporaryDatabaseAlerts = [
  {
    id: 'valid-alert-101',
    profile_id: 'owner-uuid-101',
    category: 'bill',
    title: 'June Bill Overdue',
    message: 'Your current volumetric balance due is ₱1,450.75.',
    is_read: false
  },
  {
    id: 'alert-id-purok-1',
    profile_id: 'original-owner-purok-1', 
    category: 'announcement',
    title: 'Main Pipeline Maintenance',
    message: 'Temporary water service interruption.',
    is_read: false
  }
];


router.get('/api/notifications', (req, res) => {

  req.user = { id: 'owner-uuid-101' };


  const userRows = temporaryDatabaseAlerts.filter(item => item.profile_id === req.user.id);
  
  const accountBills = userRows.filter(item => item.category === 'bill');
  const adminAnnouncements = userRows.filter(item => item.category === 'announcement');
  const unreadCount = userRows.filter(item => !item.is_read).length;

  return res.status(200).json({
    unreadCount,
    streams: { accountBills, adminAnnouncements }
  });
});


router.put('/api/notifications/:id/read', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader === 'Bearer cross-account-attacker-token') {
    req.user = { id: 'legitimate-user-purok-2' };
  } else {
    req.user = { id: 'owner-uuid-101' };
  }

  const notificationId = req.params.id;

  const targetAlert = temporaryDatabaseAlerts.find(item => item.id === notificationId);

  if (!targetAlert) {
    return res.status(404).json({ error: 'Not Found' });
  }

  if (targetAlert.profile_id !== req.user.id) {
    return res.status(403).json({ 
      error: 'Forbidden', 
      message: 'Security Violation: Access denied to cross-account notification parameters.' 
    });
  }

  targetAlert.is_read = true;

  return res.status(200).json({ modified: true, id: notificationId, is_read: true });
});

export default router;