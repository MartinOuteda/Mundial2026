const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    const query = `
      SELECT id, equipo, indice_orden
      FROM tabla_posiciones
      WHERE indice_orden IS NOT NULL
      ORDER BY indice_orden ASC
    `;

    const result = await client.query(query);
    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
