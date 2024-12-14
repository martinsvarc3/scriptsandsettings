import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const getDbClient = async () => {
  const client = createClient();
  await client.connect();
  return client;
};

// Existing GET endpoint remains the same
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  
  if (!teamId) {
    return NextResponse.json({ error: 'Team ID required' }, { status: 400 });
  }
  
  try {
    const client = await getDbClient();
    const { rows } = await client.query(
      'SELECT * FROM performance_goals WHERE team_id = $1 ORDER BY created_at DESC LIMIT 1',
      [teamId]
    );
    await client.end();
    return NextResponse.json(rows[0] || null);
  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json({ error: 'Failed to load performance goals' }, { status: 500 });
  }
}

// Modified POST endpoint to include new fields
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      teamId, 
      memberId,
      overall_performance_goal, 
      number_of_calls_average,
      call_length 
    } = body;
    
    // Require either teamId or memberId
    if ((!teamId && !memberId) || overall_performance_goal === undefined || 
        number_of_calls_average === undefined || call_length === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await getDbClient();
    
    // If teamId exists, delete any existing goals for this team
    if (teamId) {
      await client.query(
        'DELETE FROM performance_goals WHERE team_id = $1',
        [teamId]
      );
    }

    // Insert new goals
    const { rows } = await client.query(
      `INSERT INTO performance_goals 
       (team_id, member_id, overall_performance_goal, number_of_calls_average, call_length)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [teamId || null, memberId || null, overall_performance_goal, number_of_calls_average, call_length]
    );
    
    await client.end();
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json({ error: 'Failed to save performance goals' }, { status: 500 });
  }
}

// New endpoint for N8N to fetch call duration
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teamId, memberId } = body;
    
    if (!teamId && !memberId) {
      return NextResponse.json({ call_length: 10 });
    }

    const client = await getDbClient();
    let query = '';
    let params = [];

    // First try with teamId if provided
    if (teamId) {
      query = 'SELECT call_length FROM performance_goals WHERE team_id = $1 LIMIT 1';
      params = [teamId];
    } else {
      // If no teamId or no results found with teamId, try memberId
      query = 'SELECT call_length FROM performance_goals WHERE member_id = $1 LIMIT 1';
      params = [memberId];
    }

    const { rows } = await client.query(query, params);
    await client.end();

    // Return 10 if no results found
    return NextResponse.json({ 
      call_length: rows.length > 0 ? rows[0].call_length : 10 
    });

  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json({ call_length: 10 });
  }
}
