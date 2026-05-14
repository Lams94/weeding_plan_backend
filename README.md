# Wedding Plan App

React + Vite + Capacitor application with an Express/Prisma backend for wedding planning.

## Main Features

- Wedding project onboarding by role
- Guest CRM and QR passes
- Todo/planning checklist
- Vendor budget tracking
- Deposits, invoices, and paid amount history
- Android APK build through Capacitor

## Local Setup

```powershell
npm install
copy .env.example .env
npx prisma generate
npx prisma db push
npm run dev
```

## Backend Deploy Notes

Deploy `server.js` with these environment variables:

- `DATABASE_URL`
- `DIRECT_URL`
- `PORT`

After the backend is deployed, rebuild the APK with:

```powershell
$env:VITE_API_BASE_URL="https://your-backend-url"
npm run build
npx cap sync android
cd android
.\gradlew.bat --no-daemon assembleDebug
```

The APK must use a public API URL. Do not put raw PostgreSQL credentials inside the mobile app.
