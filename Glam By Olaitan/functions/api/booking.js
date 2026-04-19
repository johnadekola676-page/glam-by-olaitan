import postgres from 'postgres';

export async function onRequestPost(context) {
  const { env, request } = context;
  const body = await request.json();
  
  // Initialize Neon connection
  const sql = postgres(env.DATABASE_URL);

  try {
    const { action, date, name, phone, service, email } = body;

    // CASE 1: Check availability for a specific date
    if (action === 'check_availability') {
      const count = await sql`
        SELECT COUNT(*)::int FROM bookings 
        WHERE booking_date = ${date} AND status != 'cancelled'
      `;
      
      return new Response(JSON.stringify({ 
        available: count[0].count < 3,
        remaining: 3 - count[0].count
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // CASE 2: Finalize booking
    if (action === 'book') {
      // One last check before saving
      const count = await sql`
        SELECT COUNT(*)::int FROM bookings 
        WHERE booking_date = ${date} AND status != 'cancelled'
      `;

      if (count[0].count >= 3) {
        return new Response(JSON.stringify({ error: 'Fully booked' }), { status: 400 });
      }

      const result = await sql`
        INSERT INTO bookings (name, phone, email, service, booking_date)
        VALUES (${name}, ${phone}, ${email || null}, ${service}, ${date})
        RETURNING id
      `;

      return new Response(JSON.stringify({ 
        success: true, 
        bookingId: result[0].id 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  } finally {
    await sql.end();
  }
}
