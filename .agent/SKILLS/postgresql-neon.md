# Skill: PostgreSQL via Neon.tech

## What Is Neon
Neon is free serverless PostgreSQL. No server to manage. No credit card to start.
Free tier: 0.5GB storage, unlimited projects, autoscales to zero when not used.
You connect to it with a standard PostgreSQL connection string — any PostgreSQL library works.

## Step 1 — Create a Neon Project (one time per project)
1. Go to <https://console.neon.tech>
2. Sign in with Google or GitHub
3. Click "New Project" → give it a name → choose a region close to your users
4. Copy the connection string — it looks like:
   postgresql://username:password@ep-something.us-east-2.aws.neon.tech/dbname?sslmode=require
5. Save it to your project's .env file as:
   DATABASE_URL=postgresql://...
6. Add .env to .gitignore immediately — never commit this string

## Step 2 — Connect From Your App

### Node.js (with pg or postgres.js)
```bash
npm install postgres
```

```jsx
import postgres from 'postgres'
const sql = postgres(process.env.DATABASE_URL)

// Test connection
const result = await sql`SELECT NOW()`
console.log(result)
```

### Python (with psycopg2 or asyncpg)

```bash
pip install psycopg2-binary
# or for async:
pip install asyncpg
```

```python
import psycopg2
import os

conn = psycopg2.connect(os.environ['DATABASE_URL'])
cursor = conn.cursor()
cursor.execute("SELECT NOW()")
print(cursor.fetchone())
```

## Step 3 — Create Tables (Migrations)

Always write SQL migrations as files so changes are tracked and repeatable.
Store them in a `/migrations` folder at your project root.

### File naming: `001_initial_schema.sql`, `002_add_users.sql`, etc.

### Standard Users / Auth Table

```sql
-- migrations/001_users.sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Sessions Table

```sql
-- migrations/002_sessions.sql
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

### Running a Migration

```jsx
// run-migration.js
import postgres from 'postgres'
import fs from 'fs'

const sql = postgres(process.env.DATABASE_URL)
const migration = fs.readFileSync('./migrations/001_users.sql', 'utf8')
await sql.unsafe(migration)
console.log('Migration complete')
await sql.end()
```

```bash
node run-migration.js
```

## Common Queries

### Insert

```jsx
const user = await sql`
  INSERT INTO users (email, full_name)
  VALUES (${email}, ${fullName})
  RETURNING *
`
```

### Select with filter

```jsx
const users = await sql`
  SELECT * FROM users WHERE email = ${email} LIMIT 1
`
```

### Update

```jsx
await sql`
  UPDATE users SET full_name = ${name} WHERE id = ${id}
`
```

### Delete

```jsx
await sql`DELETE FROM users WHERE id = ${id}`
```

## Neon-Specific Tips

- Connection strings include `?sslmode=require` — always keep this, Neon requires SSL
- Neon autoscales to zero after inactivity — the first query after idle takes ~1 second (cold start)
- For production, use connection pooling: Neon provides a pooled connection string separately
- Get pooled string from: Neon console → Connection Details → toggle “Pooled connection”
- Use pooled string for your app, direct string for migrations

## Useful Neon Console Features

- SQL Editor: [https://console.neon.tech](https://console.neon.tech/) → your project → SQL Editor (run queries in browser)
- Branching: create a dev branch of your DB that mirrors production (great for testing)
- Monitoring: see query count, storage, connection count in the dashboard

## When to Move Off Free Tier

Free tier is generous for learning and early production.
Consider upgrading when:

- Storage consistently exceeds 400MB (approaching 500MB limit)
- You need more than 1 compute unit (for high-traffic production)
- You need point-in-time recovery or more branches

Neon Pro starts at $19/month with no surprise bills if configured correctly.
