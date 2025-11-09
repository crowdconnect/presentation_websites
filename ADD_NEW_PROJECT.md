# How to Add a New Project

Follow these steps to add a new Next.js project to the monorepo:

## Step 1: Add Project Folder

Place your new Next.js project in a folder at the root level, for example:
```
presentation-websites/
  ├── billing-dashboard-demo/
  ├── Mawacon Connect/
  └── your-new-project/          ← Add your project here
```

## Step 2: Update Root package.json

Add your project to the `workspaces` array and update scripts:

```json
{
  "workspaces": [
    "billing-dashboard-demo",
    "Mawacon Connect",
    "your-new-project"              ← Add here
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=billing-dashboard-demo -- --port 3001\" \"npm run dev --workspace='Mawacon Connect' -- --port 3002\" \"npm run dev --workspace=your-new-project -- --port 3003\" \"npm run dev:root\"",
    "build": "npm run build --workspace=billing-dashboard-demo && npm run build --workspace='Mawacon Connect' && npm run build --workspace=your-new-project && next build",
    "install:all": "npm install && npm install --workspace=billing-dashboard-demo && npm install --workspace='Mawacon Connect' && npm install --workspace=your-new-project"
  }
}
```

**Important:** Choose a unique port number (3003, 3004, etc.) for your new project.

## Step 3: Update next.config.mjs

Add a rewrite rule for your new project:

```javascript
async rewrites() {
  const billingUrl = process.env.NEXT_PUBLIC_BILLING_URL || process.env.BILLING_URL || 'http://localhost:3001';
  const connectUrl = process.env.NEXT_PUBLIC_CONNECT_URL || process.env.CONNECT_URL || 'http://localhost:3002';
  const newProjectUrl = process.env.NEXT_PUBLIC_NEW_PROJECT_URL || process.env.NEW_PROJECT_URL || 'http://localhost:3003';
  
  if (process.env.VERCEL) {
    return [];
  }
  
  return [
    {
      source: '/billing/:path*',
      destination: `${billingUrl}/:path*`,
    },
    {
      source: '/connect/:path*',
      destination: `${connectUrl}/:path*`,
    },
    {
      source: '/your-route/:path*',        ← Add your route here
      destination: `${newProjectUrl}/:path*`,
    },
  ];
}
```

## Step 4: Update Landing Page (app/page.tsx)

Add a new card to the landing page grid. Copy the pattern from existing projects and customize:

```tsx
<Link
  href="/your-route"
  className="group relative bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
>
  <div className="p-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
        Your Project Name
      </h2>
      {/* ... arrow icon ... */}
    </div>
    <p className="text-gray-600 mb-4">
      Description of your project.
    </p>
    {/* ... tags ... */}
  </div>
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
</Link>
```

Also update the route list at the bottom:
```tsx
<code className="bg-gray-100 px-2 py-1 rounded">/your-route</code>
```

## Step 5: Update vercel.json

Add a rewrite rule for Vercel deployment:

```json
{
  "rewrites": [
    {
      "source": "/billing/:path*",
      "destination": "https://YOUR-BILLING-APP.vercel.app/:path*"
    },
    {
      "source": "/connect/:path*",
      "destination": "https://YOUR-CONNECT-APP.vercel.app/:path*"
    },
    {
      "source": "/your-route/:path*",           ← Add here
      "destination": "https://YOUR-NEW-APP.vercel.app/:path*"
    }
  ]
}
```

## Step 6: Create vercel.json for New Project (Optional)

If deploying separately on Vercel, create `your-new-project/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## Step 7: Update README.md

Add your new project to the documentation in the README.

## Example: Adding a Project Called "Admin Portal"

1. **Folder:** `admin-portal/`
2. **Route:** `/admin`
3. **Port:** `3003`
4. **Workspace:** `admin-portal`
5. **Environment Variable:** `ADMIN_URL` or `NEXT_PUBLIC_ADMIN_URL`

Then update all the files above with these values.

## Quick Checklist

- [ ] Project folder added to root
- [ ] Added to `workspaces` in root `package.json`
- [ ] Added dev script with unique port
- [ ] Added build script
- [ ] Added install script
- [ ] Added rewrite rule in `next.config.mjs`
- [ ] Added card to landing page (`app/page.tsx`)
- [ ] Added rewrite to `vercel.json`
- [ ] Created `vercel.json` in new project folder (optional)
- [ ] Updated README.md

## Testing

After making changes:
1. Run `npm run install:all` to install dependencies
2. Run `npm run dev` to start all projects
3. Test the new route at `http://localhost:3000/your-route`

