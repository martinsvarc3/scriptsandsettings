import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Helper function to validate member ID
const validateMemberId = (memberId: string | null): boolean => {
  return Boolean(memberId && memberId.trim().length > 0);
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const category = searchParams.get('category');
    
    console.log('GET request params:', { memberId, category });

    if (!validateMemberId(memberId)) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.visionboard_PRISMA_URL
    });

    try {
      await pool.sql`SELECT 1`;
      console.log('Database connection successful');
    } catch (connectionError) {
      console.error('Database connection error:', connectionError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    let result;
    if (category) {
      console.log('Executing query with category');
      result = await pool.sql`
        SELECT * FROM scripts_of_users 
        WHERE memberstack_id = ${memberId} 
        AND category = ${category}
        ORDER BY updated_at DESC
      `;
    } else {
      console.log('Executing query without category');
      result = await pool.sql`
        SELECT * FROM scripts_of_users 
        WHERE memberstack_id = ${memberId}
        ORDER BY updated_at DESC
      `;
    }

    console.log(`Found ${result.rows.length} scripts`);

    return NextResponse.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      content: row.content,
      lastEdited: row.last_edited,
      category: row.category,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (error) {
    console.error('Error loading scripts:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to load scripts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('POST request body:', body);
    
    const { memberId, name, content, category } = body;
    console.log('Destructured values:', { memberId, name, content, category });
    
    if (!validateMemberId(memberId) || !content || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        received: { memberId, content, category }
      }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.visionboard_PRISMA_URL
    });

    console.log('Executing INSERT query with values:', {
      memberId,
      name: name || 'Untitled Script',
      contentLength: content?.length,
      category
    });

    const { rows } = await pool.sql`
      INSERT INTO scripts_of_users 
      (memberstack_id, name, content, category, last_edited, created_at, updated_at)
      VALUES 
      (${memberId}, ${name || 'Untitled Script'}, ${content}, ${category}, 
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    console.log('Insert successful, returning row:', rows[0]);

    return NextResponse.json({
      id: rows[0].id,
      name: rows[0].name,
      content: rows[0].content,
      lastEdited: rows[0].last_edited,
      category: rows[0].category,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at
    });
  } catch (error) {
    console.error('Error saving script:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
    }
    
    return NextResponse.json({ 
      error: 'Failed to save script',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log('PUT request body:', body);
    const { id, memberId, name, content, category } = body;

    if (!id || !validateMemberId(memberId)) {
      return NextResponse.json({ 
        error: 'ID and Member ID required',
        received: { id, memberId }
      }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.visionboard_PRISMA_URL
    });

    const updateParts = [];
    const updateValues = [];

    if (name !== undefined) updateParts.push('name = ${name}');
    if (content !== undefined) updateParts.push('content = ${content}');
    if (category !== undefined) updateParts.push('category = ${category}');
    updateParts.push('last_edited = CURRENT_TIMESTAMP', 'updated_at = CURRENT_TIMESTAMP');

    if (updateParts.length === 2) { // Only timestamps are being updated
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { rows } = await pool.sql`
      UPDATE scripts_of_users 
      SET ${pool.sql(updateParts.join(', '))}
      WHERE id = ${id} AND memberstack_id = ${memberId}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: rows[0].id,
      name: rows[0].name,
      content: rows[0].content,
      lastEdited: rows[0].last_edited,
      category: rows[0].category,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at
    });
  } catch (error) {
    console.error('Error updating script:', error);
    return NextResponse.json({ 
      error: 'Failed to update script',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const memberId = searchParams.get('memberId');
    
    console.log('DELETE request params:', { id, memberId });

    if (!id || !validateMemberId(memberId)) {
      return NextResponse.json({ 
        error: 'ID and Member ID required',
        received: { id, memberId }
      }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.visionboard_PRISMA_URL
    });

    const { rows } = await pool.sql`
      DELETE FROM scripts_of_users 
      WHERE id = ${id} AND memberstack_id = ${memberId}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting script:', error);
    return NextResponse.json({ 
      error: 'Failed to delete script',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
