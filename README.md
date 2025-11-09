# Presentation Websites Monorepo

This monorepo contains two Next.js projects that can be accessed as routes from a single root application.

## Projects

1. **Billing Dashboard** (`billing-dashboard-demo/`) - Accessible at `/billing`
2. **Mawacon Connect** (`Mawacon Connect/`) - Accessible at `/connect`

## Setup

1. Install dependencies for all projects:
```bash
npm run install:all
```

2. Start all development servers:
```bash
npm run dev
```

This will start:
- Root app on `http://localhost:3000` (landing page and router)
- Billing Dashboard on `http://localhost:3001` (proxied at `/billing`)
- Mawacon Connect on `http://localhost:3002` (proxied at `/connect`)

## Access Routes

- **Root/Landing**: `http://localhost:3000`
- **Billing Dashboard**: `http://localhost:3000/billing`
- **Mawacon Connect**: `http://localhost:3000/connect`

## Development

Each project can also be run independently:
- `cd billing-dashboard-demo && npm run dev`
- `cd "Mawacon Connect" && npm run dev`

## Deployment on Vercel

Vercel has excellent support for monorepos! Here's how to deploy:

### Option 1: Deploy as Separate Projects (Recommended)

1. **Deploy Billing Dashboard:**
   - Go to Vercel dashboard
   - Import project from your repo
   - Set **Root Directory** to `billing-dashboard-demo`
   - Deploy (Vercel will auto-detect Next.js)
   - Note the deployment URL (e.g., `billing-dashboard.vercel.app`)

2. **Deploy Mawacon Connect:**
   - Create another project in Vercel
   - Set **Root Directory** to `Mawacon Connect`
   - Deploy and note the URL (e.g., `mawacon-connect.vercel.app`)

3. **Deploy Root App:**
   - Create a third project in Vercel
   - Set **Root Directory** to `.` (root)
   - **Before deploying**, update `vercel.json` in the root directory with the actual URLs from steps 1 & 2:
     - Replace `YOUR-BILLING-APP.vercel.app` with your billing app's URL
     - Replace `YOUR-CONNECT-APP.vercel.app` with your connect app's URL
   - Deploy

### Option 2: Use Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy each project
cd billing-dashboard-demo && vercel
cd "../Mawacon Connect" && vercel
cd .. && vercel
```

### Option 3: Automatic Monorepo Detection

Vercel can automatically detect multiple Next.js apps in your monorepo. When you import the project:

1. Vercel will show you all detected apps
2. You can deploy each one separately
3. Each gets its own URL
4. Update the root `vercel.json` with the deployment URLs

## Environment Variables

For the root app, you can also use environment variables instead of hardcoding URLs in `vercel.json`:

- `NEXT_PUBLIC_BILLING_URL` - Billing app URL
- `NEXT_PUBLIC_CONNECT_URL` - Connect app URL

## Production Build

For local production testing:

```bash
npm run build
npm start
```

## Notes

- The root Next.js app uses rewrites to proxy requests to the sub-apps
- For development, both sub-apps run on ports 3001 and 3002
- Vercel handles rewrites via `vercel.json` in production
- Each project maintains its own dependencies and configurations
- All three apps can be deployed from the same repository

