import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const getDbClient = async () => {
  const client = createClient();
  await client.connect();
  return client;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamId = searchParams.get('teamId');
  const memberId = searchParams.get('memberId');

  if (!teamId && !memberId) {
    return NextResponse.json({ call_length: 10 });
  }

  try {
    const client = await getDbClient();
    let query = '';
    let params = [];

    // First try with teamId if provided
    if (teamId) {
      query = 'SELECT call_length FROM performance_goals WHERE team_id = $1 LIMIT 1';
      params = [teamId];
      const { rows } = await client.query(query, params);
      
      // If no results with teamId and memberId is provided, try memberId
      if (rows.length === 0 && memberId) {
        query = 'SELECT call_length FROM performance_goals WHERE member_id = $1 LIMIT 1';
        params = [memberId];
        const memberResult = await client.query(query, params);
        await client.end();
        return NextResponse.json({ 
          call_length: memberResult.rows.length > 0 ? memberResult.rows[0].call_length : 10 
        });
      }
      
      await client.end();
      return NextResponse.json({ 
        call_length: rows.length > 0 ? rows[0].call_length : 10 
      });
    }
    
    // If only memberId is provided
    if (memberId) {
      query = 'SELECT call_length FROM performance_goals WHERE member_id = $1 LIMIT 1';
      params = [memberId];
      const { rows } = await client.query(query, params);
      await client.end();
      return NextResponse.json({ 
        call_length: rows.length > 0 ? rows[0].call_length : 10 
      });
    }

    await client.end();
    return NextResponse.json({ call_length: 10 });

  } catch (err) {
    console.error('Database error:', err);
    return NextResponse.json({ call_length: 10 });
  }
}
