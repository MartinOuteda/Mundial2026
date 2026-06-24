const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    const resultado = await client.query(`
      SELECT 
        ce.id, ce.fase, ce.partido_numero as numero,
        e1.nombre as equipo1, e2.nombre as equipo2,
        eg.nombre as ganador, ce.goles_1, ce.goles_2,
        ce.equipo_1_id, ce.equipo_2_id, ce.ganador_id
      FROM cuadro_eliminatorio ce
      LEFT JOIN equipos e1 ON ce.equipo_1_id = e1.id
      LEFT JOIN equipos e2 ON ce.equipo_2_id = e2.id
      LEFT JOIN equipos eg ON ce.ganador_id = eg.id
      ORDER BY ce.fase, ce.partido_numero
    `);

    const cuadro = {};
    resultado.rows.forEach(partido => {
      if (!cuadro[partido.fase]) {
        cuadro[partido.fase] = [];
      }
      cuadro[partido.fase].push(partido);
    });

    await client.end();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuadro)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
