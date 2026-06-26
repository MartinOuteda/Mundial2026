const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    const query = `
      WITH ranked AS (
        SELECT *,
          ROW_NUMBER() OVER (PARTITION BY grupo ORDER BY puntos DESC, goles_a_favor - goles_en_contra DESC) as posicion
        FROM tabla_posiciones
      )
      SELECT 
        tp.id,
        tp.equipo_id,
        e.nombre as nombre_equipo,
        tp.grupo,
        tp.puntos as pts,
        (tp.victorias + tp.empates + tp.derrotas) as pj,
        tp.goles_a_favor as gf,
        tp.goles_en_contra as gc,
        (tp.goles_a_favor - tp.goles_en_contra) as dg,
        tp.indice_orden
      FROM ranked tp
      LEFT JOIN equipos e ON tp.equipo_id = e.id
      WHERE posicion = 3
      ORDER BY tp.puntos DESC, (tp.goles_a_favor - tp.goles_en_contra) DESC
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
