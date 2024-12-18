import { createPool } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');
    const category = searchParams.get('category');
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.visionboard_PRISMA_URL
    });

    let query = 'SELECT * FROM scripts_of_users WHERE memberstack_id = $1';
    const params = [memberId];

    if (category) {
      query += ' AND category = $2';
      params.push(category);
    }

    query += ' ORDER BY updated_at DESC';

    const { rows } = await pool.query(query, params);

    return NextResponse.json(rows.map(row => ({
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
    return NextResponse.json({ error: 'Failed to load scripts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberId, name, content, category } = body;
    
    if (!memberId || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.visionboard_PRISMA_URL
    });

    const { rows } = await pool.sql`
      INSERT INTO scripts_of_users 
      (memberstack_id, name, content, category, last_edited, created_at, updated_at)
      VALUES 
      (${memberId}, ${name || 'Untitled Script'}, ${content}, ${category}, 
       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;

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
    return NextResponse.json({ error: 'Failed to save script' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, memberId, name, content, category } = body;

    if (!id || !memberId) {
      return NextResponse.json({ error: 'ID and Member ID required' }, { status: 400 });
    }

    const pool = createPool({
      connectionString: process.env.visionboard_PRISMA_URL
    });

    const updateFields = [];
    const values = [memberId, id];

    if (name) updateFields.push(`name = ${name}`);
    if (content) updateFields.push(`content = ${content}`);
    if (category) updateFields.push(`category = ${category}`);

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { rows } = await pool.sql`
      UPDATE scripts_of_users 
      SET ${updateFields.join(', ')}, 
          last_edited = CURRENT_TIMESTAMP, 
          updated_at = CURRENT_TIMESTAMP
      WHERE memberstack_id = ${memberId} AND id = ${id}
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
    return NextResponse.json({ error: 'Failed to update script' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const memberId = searchParams.get('memberId');
    
    if (!id || !memberId) {
      return NextResponse.json({ error: 'ID and Member ID required' }, { status: 400 });
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
    return NextResponse.json({ error: 'Failed to delete script' }, { status: 500 });
  }
}
