const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { matchId, goles1, goles2 } = JSON.parse(event.body);

    const goles1Int = parseInt(goles1);
    const goles2Int = parseInt(goles2);

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    // SOLO guardar goles, nada más
    const query = `
      UPDATE cuadro_eliminatorio 
      SET goles_1 = $1, goles_2 = $2
      WHERE id = $3
      RETURNING *
    `;

    const result = await client.query(query, [goles1Int, goles2Int, parseInt(matchId)]);
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
