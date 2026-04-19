const postgres = require('postgres');
const path = require('path');
// Explicitly point to the .env file in the parent directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sql = postgres(process.env.DATABASE_URL);

async function createTable() {
  try {
    console.log('Connecting to:', process.env.DATABASE_URL.split('@')[1]); // Log host for verification
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        service TEXT NOT NULL,
        booking_date DATE NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;
    console.log('✅ Table "bookings" created successfully!');
    await sql`CREATE INDEX IF NOT EXISTS idx_booking_date ON bookings(booking_date);`;
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to create table:', err);
    process.exit(1);
  }
}

createTable();
