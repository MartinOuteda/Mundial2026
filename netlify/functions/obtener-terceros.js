const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const resultado = await client.query(`
      SELECT e.nombre, e.grupo, tp.puntos, tp.goles_a_favor
      FROM tabla_posiciones tp
      JOIN equipos e ON tp.equipo_id = e.id
      ORDER BY tp.puntos DESC, tp.goles_a_favor DESC
    `);

    await client.end();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultado.rows)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
