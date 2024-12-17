import { createClient } from '@vercel/postgres';
import { NextResponse } from 'next/server';

const getDbClient = async () => {
  const client = createClient();
  await client.connect();
  return client;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const memberstackId = searchParams.get('memberstackId');
  const category = searchParams.get('category');
  
  console.log('GET request params:', { memberstackId, category });

  if (!memberstackId) {
    console.log('Missing memberstackId in GET request');
    return NextResponse.json({ error: 'Memberstack ID required' }, { status: 400 });
  }

  try {
    const client = await getDbClient();
    let query = 'SELECT * FROM scripts_of_users WHERE memberstack_id = $1';
    const params = [memberstackId];

    if (category) {
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    query += ' ORDER BY updated_at DESC';
    console.log('Executing GET query:', { query, params });

    const { rows } = await client.query(query, params);
    await client.end();

    console.log(`Found ${rows.length} scripts`);

    return NextResponse.json(rows.map(row => ({
      id: row.id,
      name: row.name,
      content: row.content,
      lastEdited: row.last_edited,
      category: row.category,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    })));
  } catch (err) {
    console.error('Database error in GET:', err);
    return NextResponse.json({ error: 'Failed to load scripts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberstackId, name, content, category } = body;
    
    console.log('POST request body:', { memberstackId, name, category });

    if (!memberstackId || !content || !category) {
      console.log('Missing required fields in POST:', { memberstackId, content, category });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await getDbClient();

    const query = `
      INSERT INTO scripts_of_users 
      (memberstack_id, name, content, category, last_edited, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    const params = [memberstackId, name || 'Untitled Script', content, category];
    
    console.log('Executing POST query:', { query, params: params.map(p => typeof p === 'string' ? p.substring(0, 50) : p) });

    const { rows } = await client.query(query, params);
    await client.end();

    const savedScript = {
      id: rows[0].id,
      name: rows[0].name,
      content: rows[0].content,
      lastEdited: rows[0].last_edited,
      category: rows[0].category,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at
    };

    console.log('Successfully created script:', { id: savedScript.id, name: savedScript.name });
    return NextResponse.json(savedScript);
  } catch (err) {
    console.error('Database error in POST:', err);
    return NextResponse.json({ error: 'Failed to save script' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, memberstackId, name, content, category } = body;
    
    console.log('PUT request body:', { id, memberstackId, name, category });

    if (!id || !memberstackId) {
      console.log('Missing required fields in PUT:', { id, memberstackId });
      return NextResponse.json({ error: 'ID and Memberstack ID required' }, { status: 400 });
    }

    const client = await getDbClient();

    const updateFields = [];
    const values = [memberstackId, id];
    let paramCount = 3;

    const fieldsToUpdate: Record<string, any> = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (content !== undefined) fieldsToUpdate.content = content;
    if (category !== undefined) fieldsToUpdate.category = category;

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const query = `
      UPDATE scripts_of_users 
      SET ${updateFields.join(', ')}, last_edited = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE memberstack_id = $1 AND id = $2
      RETURNING *
    `;

    console.log('Executing PUT query:', { query, values: values.map(v => typeof v === 'string' ? v.substring(0, 50) : v) });

    const { rows } = await client.query(query, values);
    await client.end();

    if (rows.length === 0) {
      console.log('No script found to update:', { id, memberstackId });
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const updatedScript = {
      id: rows[0].id,
      name: rows[0].name,
      content: rows[0].content,
      lastEdited: rows[0].last_edited,
      category: rows[0].category,
      createdAt: rows[0].created_at,
      updatedAt: rows[0].updated_at
    };

    console.log('Successfully updated script:', { id: updatedScript.id, name: updatedScript.name });
    return NextResponse.json(updatedScript);
  } catch (err) {
    console.error('Database error in PUT:', err);
    return NextResponse.json({ error: 'Failed to update script' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const memberstackId = searchParams.get('memberstackId');
  
  console.log('DELETE request params:', { id, memberstackId });

  if (!id || !memberstackId) {
    console.log('Missing required fields in DELETE:', { id, memberstackId });
    return NextResponse.json({ error: 'ID and Memberstack ID required' }, { status: 400 });
  }

  try {
    const client = await getDbClient();

    const query = 'DELETE FROM scripts_of_users WHERE id = $1 AND memberstack_id = $2 RETURNING id';
    console.log('Executing DELETE query:', { query, params: [id, memberstackId] });

    const { rows } = await client.query(query, [id, memberstackId]);
    await client.end();

    if (rows.length === 0) {
      console.log('No script found to delete:', { id, memberstackId });
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    console.log('Successfully deleted script:', { id });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Database error in DELETE:', err);
    return NextResponse.json({ error: 'Failed to delete script' }, { status: 500 });
  }
}
