const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    // Los terceros son los 12 registros después de ordenar por grupo y puntos
    // (quedan como 3er lugar de cada grupo)
    const query = `
      WITH ranked AS (
        SELECT *,
          ROW_NUMBER() OVER (PARTITION BY grupo ORDER BY puntos DESC, goles_a_favor - goles_en_contra DESC) as posicion
        FROM tabla_posiciones
      )
      SELECT * FROM ranked
      WHERE posicion = 3
      ORDER BY puntos DESC, goles_a_favor - goles_en_contra DESC
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
