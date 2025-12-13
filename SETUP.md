# Poultry Farm Management System - Setup Guide

A complete MongoDB-based poultry farm management dashboard with multi-user authentication, batch tracking, mortality/egg/feed logging, vaccination scheduling, and browser notifications.

## Prerequisites

- **Node.js v20.9.0 or higher** (you currently have v18.20.8 - upgrade required)
- MongoDB Atlas account (free tier available)
- A modern web browser

## 1. Upgrade Node.js

You'll need to upgrade to Node.js v20 or higher:

```bash
# Download and install Node.js 20 LTS from https://nodejs.org/
# Or use a version manager like nvm
```

## 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new cluster (M0 free tier is sufficient)
3. Go to "Database Access" and create a database user
   - Username: `poultry-admin` (or your choice)
   - Password: Generate a strong password
4. Go to "Network Access" and add IP address:
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Go to "Database" → "Connect" → "Connect your application"
6. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 3. Configure Environment Variables

Edit `.env.local` file and add your actual values:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://poultry-admin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/poultry-farm?retryWrites=true&w=majority

# NextAuth Configuration
# Generate a secret: run "openssl rand -base64 32" in terminal
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET_HERE
NEXTAUTH_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

**Important:**
- Replace `YOUR_PASSWORD` with your MongoDB user password
- Replace `YOUR_GENERATED_SECRET_HERE` with output from `openssl rand -base64 32`
- Do NOT commit `.env.local` to git (it's already in `.gitignore`)

## 4. Install Dependencies

```bash
npm install
```

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 6. First-Time Setup

1. Click "Create Account" on the landing page
2. Register with:
   - Full Name
   - Email
   - Password (min 6 characters)
3. After registration, click "Sign In"
4. You'll be redirected to the dashboard

## Features

### ✅ Implemented Features

1. **User Authentication**
   - Multi-user support with email/password
   - JWT-based sessions
   - Protected routes

2. **Batch Management**
   - Create and manage poultry batches
   - Track batch size, breed, start date
   - Automatic age calculation
   - Archive old batches

3. **Mortality Tracking**
   - Record bird deaths by batch
   - Automatic batch size reduction
   - Age group classification (chick <90d / adult >=90d)

4. **Egg Production**
   - Daily egg collection logging
   - Track eggs sold and spoiled
   - Monthly aggregation charts (last 6 months)
   - Warning if batch too young (<135 days)

5. **Incubator Management**
   - Log eggs inserted, spoiled, hatched
   - Auto-add hatched chicks to first active batch
   - Auto-create new batch if none exists

6. **Feed Tracking**
   - Record feed purchases (type, price, bags, kg)
   - Total feed inventory (bags and kg)
   - Automatic totals calculation

7. **Vaccination Schedule**
   - Schedule vaccinations by batch age
   - Track status: pending/completed/overdue
   - Mark vaccinations as complete
   - Visual status badges

8. **Browser Notifications**
   - Notification permission request
   - Alerts for overdue vaccinations
   - Periodic checks (every 4 hours)

9. **Dark Mode**
   - System preference detection
   - Toggle between light/dark themes
   - Persistent preference

10. **Dashboard**
    - Summary cards (birds, chicks, adults, eggs, feed)
    - Quick action buttons
    - Monthly egg production chart
    - Vaccination schedule table

## Project Structure

```
C:\work\poultry-farm\
├── app/
│   ├── (auth)/                  # Auth pages group
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/             # Dashboard group
│   │   ├── layout.tsx           # Dashboard layout with nav
│   │   └── dashboard/page.tsx   # Main dashboard
│   ├── api/                     # API routes
│   │   ├── auth/
│   │   ├── batches/
│   │   ├── mortality/
│   │   ├── eggs/
│   │   ├── incubator/
│   │   ├── feed/
│   │   └── vaccinations/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css
├── components/
│   ├── ui/                      # shadcn components
│   ├── dashboard/               # Dashboard components
│   ├── dialogs/                 # Action dialogs
│   ├── theme/                   # Theme components
│   └── notifications/           # Notification system
├── lib/
│   ├── auth/                    # Auth config
│   ├── db/                      # MongoDB connection
│   ├── models/                  # Mongoose models (7 models)
│   ├── utils/                   # Utility functions
│   └── validations/             # Zod schemas
├── middleware.ts                # Route protection
├── .env.local                   # Environment variables
└── package.json

7 Mongoose Models:
- User: Authentication
- Batch: Poultry batches
- Mortality: Death records
- Egg: Daily egg logs
- Incubator: Hatching records
- Feed: Purchase logs
- Vaccination: Vaccine schedule
```

## API Routes

All API routes are protected and filter data by user ID:

- `GET /api/batches` - List all batches
- `POST /api/batches` - Create batch
- `GET /api/batches/:id` - Get batch
- `PATCH /api/batches/:id` - Update batch
- `DELETE /api/batches/:id` - Delete batch
- `POST /api/mortality` - Record mortality
- `GET /api/mortality` - List mortality logs
- `POST /api/eggs` - Log eggs
- `GET /api/eggs` - List egg logs
- `GET /api/eggs/stats` - Monthly aggregation
- `POST /api/incubator` - Update incubator
- `GET /api/incubator` - List incubator logs
- `POST /api/feed` - Log feed purchase
- `GET /api/feed` - List feed logs
- `GET /api/feed/stats` - Total feed stats
- `POST /api/vaccinations` - Schedule vaccination
- `GET /api/vaccinations` - List vaccinations
- `PATCH /api/vaccinations/:id` - Mark completed
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handler

## Business Logic

### Mortality Recording
1. Select batch
2. Enter death count
3. System calculates age group (chick/adult) based on batch age
4. Batch size automatically reduced
5. Log created with timestamp

### Egg Logging
1. Enter collected/sold/spoiled counts
2. System checks if any batch is old enough (135+ days)
3. Warning shown if all batches too young
4. User can override and proceed
5. Daily log created

### Incubator Updates
1. Log inserted/spoiled/hatched/not-hatched
2. If hatched > 0:
   - Find first active batch (by start date)
   - Add hatched count to batch size
   - If no active batch, create new: "Hatched Batch YYYY-MM-DD"

### Vaccination Status
Status calculated dynamically (not stored):
- `completed`: completedDate exists
- `overdue`: scheduledDate < today && no completedDate
- `pending`: scheduledDate >= today && no completedDate

## Troubleshooting

### Build fails with Node.js version error
- **Solution**: Upgrade to Node.js v20+
- Download from: https://nodejs.org/

### MongoDB connection errors
- Check MONGODB_URI in `.env.local`
- Ensure MongoDB Atlas user password is correct
- Verify Network Access allows your IP (0.0.0.0/0 for dev)
- Check database name in connection string

### NextAuth errors
- Ensure NEXTAUTH_SECRET is set (32+ characters)
- Check NEXTAUTH_URL matches your dev server
- Clear browser cookies and try again

### TypeScript errors
- Run: `npm run build` to see full error list
- Check imports are correct
- Ensure all required types are defined

### Dark mode not working
- Clear localStorage
- Check browser console for errors
- Ensure ThemeProvider wraps app in root layout

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET` (generate new for production)
   - `NEXTAUTH_URL` (your production URL)
4. Deploy

### MongoDB Atlas for Production

1. Update Network Access to allow Vercel IPs
2. Consider upgrading to M10+ cluster for better performance
3. Enable MongoDB backups
4. Set up monitoring alerts

## Security Notes

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT-based sessions
- ✅ All API routes protected with session checks
- ✅ User data isolation (userId filter on all queries)
- ✅ Input validation with Zod schemas
- ✅ MongoDB injection prevention (Mongoose)
- ✅ HTTPS required for browser notifications in production

## Support

For issues or questions:
- Check the code comments
- Review API route implementations
- Check browser console for client errors
- Review server logs for API errors

## License

This is a custom-built application for poultry farm management.
