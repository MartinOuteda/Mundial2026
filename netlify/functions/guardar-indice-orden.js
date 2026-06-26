const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const { equipoId, indiceOrden } = JSON.parse(event.body);

    if (!equipoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'equipoId is required' })
      };
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    const query = `
      UPDATE tabla_posiciones
      SET indice_orden = $1
      WHERE id = $2
      RETURNING *
    `;

    const result = await client.query(query, [indiceOrden, equipoId]);
    await client.end();

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Equipo no encontrado' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result.rows[0]
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
