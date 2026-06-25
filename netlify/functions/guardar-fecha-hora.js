const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const { matchId, fechaHora } = JSON.parse(event.body);

  if (!matchId || !fechaHora) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan parámetros' }) };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    const query = `
      UPDATE cuadro_eliminatorio 
      SET fecha_hora = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await client.query(query, [fechaHora, parseInt(matchId)]);

    if (result.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Partido no encontrado' }) };
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ success: true, match: result.rows[0] }) 
    };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  } finally {
    await client.end();
  }
};
