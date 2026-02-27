# Amanah - Deployment Guide

## Quick Start: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps

#### 1. Push to GitHub
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Amanah family crowdfunding app"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/amanah.git
git branch -M main
git push -u origin main
```

#### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

5. Click "Deploy"

**That's it!** Your app will be live in 2-3 minutes at `https://your-project.vercel.app`

---

## Current App Status

### ✅ What Works
- All pages and features are functional
- Multi-language support (English, Swedish, Arabic)
- Campaign voting and approval system
- Group management
- Contribution tracking
- Responsive design

### ⚠️ Important Notes

#### Data Storage
Currently using **localStorage** for data storage:
- Data is stored in the browser only
- Each user has their own local data
- Data is lost if browser cache is cleared
- Not shared between devices or users

#### For Production Use
You'll need to replace localStorage with a real database:

**Option 1: Supabase (Easiest)**
```bash
npm install @supabase/supabase-js
```
- Free tier available
- PostgreSQL database
- Real-time subscriptions
- Authentication built-in

**Option 2: PlanetScale**
- MySQL database
- Free tier available
- Works with Prisma (already in project)

**Option 3: MongoDB Atlas**
- NoSQL database
- Free tier available
- Good for flexible schemas

#### Authentication
Currently using **mock authentication**:
- No real user verification
- Passwords not encrypted
- Sessions stored in localStorage

For production, implement:
- NextAuth.js (already installed)
- OAuth providers (Google, GitHub, etc.)
- Or Supabase Auth

---

## Alternative Deployment Options

### Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select repository
5. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
6. Deploy

### Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Next.js
6. Deploy

### Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Click "New" → "Web Service"
4. Connect GitHub repository
5. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
6. Deploy

---

## Environment Variables

If you add a database or external services, you'll need to set environment variables:

### On Vercel:
1. Go to Project Settings → Environment Variables
2. Add variables like:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

### On Netlify:
1. Site Settings → Environment Variables
2. Add your variables

### On Railway/Render:
1. Project Settings → Variables
2. Add your variables

---

## Custom Domain

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### On Netlify:
1. Domain Settings → Add custom domain
2. Follow DNS configuration steps

---

## Database Migration (When Ready)

### Step 1: Choose Database Provider
Example with Supabase:

```bash
# Install Supabase client
npm install @supabase/supabase-js
```

### Step 2: Create Database Tables
Based on your current data structure:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Group members table
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  beneficiary_name TEXT NOT NULL,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  target_amount DECIMAL NOT NULL,
  current_amount DECIMAL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  votes INTEGER DEFAULT 0,
  contributors INTEGER DEFAULT 0,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Campaign votes table
CREATE TABLE campaign_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(campaign_id, user_id)
);

-- Contributions table
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  amount DECIMAL NOT NULL,
  currency TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  campaign_id UUID REFERENCES campaigns(id),
  amount DECIMAL,
  currency TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 3: Update Code
Replace `src/lib/mockData.ts` functions with database queries.

---

## Performance Optimization

Before going live, consider:

1. **Image Optimization**
   - Use Next.js Image component
   - Compress images

2. **Code Splitting**
   - Already handled by Next.js

3. **Caching**
   - Configure in `next.config.mjs`

4. **Analytics**
   - Add Vercel Analytics (free)
   - Or Google Analytics

---

## Security Checklist

Before production:

- [ ] Replace mock authentication with real auth
- [ ] Add HTTPS (automatic on Vercel/Netlify)
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Validate all user inputs
- [ ] Sanitize data before display
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Add Content Security Policy

---

## Monitoring

### Free Options:
- **Vercel Analytics** (if using Vercel)
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Google Analytics** for user tracking

---

## Cost Estimate

### Free Tier (Good for testing/small use):
- **Hosting:** Free (Vercel/Netlify/Railway)
- **Database:** Free (Supabase/PlanetScale)
- **Total:** $0/month

### Production (Recommended):
- **Hosting:** $20/month (Vercel Pro)
- **Database:** $25/month (Supabase Pro)
- **Total:** ~$45/month

### Scale (1000+ users):
- **Hosting:** $20-100/month
- **Database:** $25-100/month
- **CDN:** Included
- **Total:** ~$50-200/month

---

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Repository imported to Vercel
- [ ] Deployment successful
- [ ] App tested online
- [ ] Custom domain added (optional)
- [ ] Analytics configured (optional)

**Your app is now live! 🎉**

For database migration and production features, follow the sections above.
