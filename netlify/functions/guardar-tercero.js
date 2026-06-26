const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { matchId, equipoId } = JSON.parse(event.body);

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    // Asignar tercero como equipo_2 en el partido
    const query = `
      UPDATE cuadro_eliminatorio 
      SET equipo_2_id = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await client.query(query, [parseInt(equipoId), parseInt(matchId)]);
    await client.end();

    if (result.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Partido no encontrado' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result.rows[0] })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
