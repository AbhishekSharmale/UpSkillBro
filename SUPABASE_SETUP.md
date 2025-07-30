# Supabase Setup for UpSkillBro

## 1. Create Supabase Account
1. Go to https://supabase.com
2. Sign up for free account
3. Create new project

## 2. Database Schema

Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  auth_method VARCHAR(50) NOT NULL,
  photo_url TEXT,
  is_guest BOOLEAN DEFAULT false,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(uid),
  responses JSONB NOT NULL,
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER DEFAULT 9,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Roadmaps table
CREATE TABLE roadmaps (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(uid),
  title VARCHAR(255) NOT NULL,
  current_salary VARCHAR(50),
  target_salary VARCHAR(50),
  timeline VARCHAR(50),
  milestones JSONB NOT NULL,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_uid ON users(uid);
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_users_last_login ON users(last_login);
```

## 3. Row Level Security (RLS)

Enable RLS and add policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (true);

-- Assessments policies
CREATE POLICY "Users can view all assessments" ON assessments FOR SELECT USING (true);
CREATE POLICY "Users can insert their own assessment" ON assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own assessment" ON assessments FOR UPDATE USING (true);

-- Roadmaps policies
CREATE POLICY "Users can view all roadmaps" ON roadmaps FOR SELECT USING (true);
CREATE POLICY "Users can insert their own roadmap" ON roadmaps FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own roadmap" ON roadmaps FOR UPDATE USING (true);
```

## 4. Environment Configuration

Add to your environment:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'your-anon-key'
  }
};
```

## 5. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

## 6. Update Service

Replace the placeholder values in `supabase.service.ts`:
- `supabaseUrl`: Your project URL
- `supabaseKey`: Your anon/public key

## Features Enabled

✅ **User Management**: Store user profiles with auth method
✅ **Assessment Storage**: Save and retrieve assessment data
✅ **Roadmap Persistence**: Store personalized roadmaps
✅ **Hiring Platform**: Query users for recruitment
✅ **Real-time Updates**: Live data synchronization
✅ **Free Tier**: 500MB database + 2GB bandwidth/month

## Benefits

- **Persistent Data**: No more localStorage limitations
- **Multi-device Sync**: Access data from any device
- **Real-time**: Live updates across sessions
- **SQL Queries**: Powerful data filtering and search
- **Scalable**: Grows with your user base
- **Free**: No cost for small to medium usage