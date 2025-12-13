# Notification System

The poultry farm management system includes a comprehensive notification system for vaccination reminders and other important events.

## Features

### 1. In-App Notifications
- Real-time notification bell in the navigation bar
- Unread notification badge with count
- Dropdown menu to view and manage notifications
- Mark individual notifications as read
- Mark all notifications as read at once
- Auto-refresh every 30 seconds

### 2. Email Notifications
- Email reminders for upcoming vaccinations
- Sent automatically based on schedule
- Includes vaccination details and batch information

### 3. Vaccination Calendar View
- Calendar visualization of vaccination schedules
- Color-coded status indicators:
  - Green: Completed vaccinations
  - Yellow: Pending vaccinations
  - Red: Overdue vaccinations
- Click on any date to view vaccinations scheduled for that day
- Mark vaccinations as completed directly from the calendar

## Setup Email Notifications

### Step 1: Get a Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Email Configuration
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=Poultry Farm <noreply@yourdomain.com>
```

**Note:** Replace `yourdomain.com` with your actual verified domain in Resend. For testing, Resend allows sending to your own email without domain verification.

### Step 3: Set Up Automated Reminders

The reminder system checks for upcoming vaccinations and sends notifications. You need to set up a scheduled task to call the reminder check endpoint regularly.

#### Option A: Vercel Cron (Recommended for Vercel deployments)

Create a `vercel.json` file in your project root:

```json
{
  "crons": [
    {
      "path": "/api/reminders/check",
      "schedule": "0 8 * * *"
    }
  ]
}
```

This runs the check daily at 8 AM UTC.

#### Option B: External Cron Service

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com):

1. Create an account
2. Set up a new cron job
3. URL: `https://yourdomain.com/api/reminders/check`
4. Schedule: Daily at your preferred time (e.g., 8:00 AM)

#### Option C: Server Cron Job

If you're running on a VPS or server, add this to your crontab:

```bash
# Run daily at 8 AM
0 8 * * * curl https://yourdomain.com/api/reminders/check
```

### Step 4: Manual Testing

You can manually trigger the reminder check by visiting:

```
http://localhost:3000/api/reminders/check
```

This will:
- Check for vaccinations due today, tomorrow, or in 3 days
- Create in-app notifications
- Send email notifications (if configured)
- Return a summary of actions taken

## Notification Triggers

### Vaccination Reminders

Notifications are automatically created for:
- Vaccinations scheduled TODAY
- Vaccinations scheduled TOMORROW
- Vaccinations scheduled in 3 DAYS

### How It Works

1. The `/api/reminders/check` endpoint is called (manually or via cron)
2. It queries the database for upcoming vaccinations
3. For each upcoming vaccination:
   - Creates an in-app notification
   - Sends an email notification (if email is configured)
   - Avoids duplicate notifications for the same day
4. Users see notifications in the notification bell
5. Users receive emails at their registered email address

## Notification Types

- **Vaccination**: Reminders for scheduled vaccinations
- **Mortality**: Alerts about mortality events (future feature)
- **General**: System-wide announcements (future feature)

## API Endpoints

### Get Notifications
```
GET /api/notifications
GET /api/notifications?unread=true
```

### Mark as Read
```
PATCH /api/notifications
Body: { "notificationId": "id" } // Mark single notification
Body: { "markAllAsRead": true }  // Mark all as read
```

### Check Reminders
```
GET /api/reminders/check
```

## Troubleshooting

### Emails Not Sending

1. Check that `RESEND_API_KEY` is set in `.env.local`
2. Verify your domain in Resend (for production)
3. Check Resend dashboard for delivery logs
4. Ensure `EMAIL_FROM` uses a verified domain

### Notifications Not Appearing

1. Check browser console for errors
2. Verify MongoDB connection
3. Ensure the reminder check endpoint is being called
4. Check that vaccinations are scheduled in the future

### Duplicate Notifications

The system prevents duplicate notifications by checking if a notification was already created for the same vaccination on the same day. If you're seeing duplicates, check your cron schedule.

## Future Enhancements

- Custom notification preferences
- SMS notifications
- Push notifications
- Notification categories and filters
- Notification history and archive
- Configurable reminder timing (1 day, 3 days, 1 week before)
