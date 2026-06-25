const { Client } = require('pg');

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    // Obtener el 3er clasificado de cada grupo (12 terceros)
    const query = `
      SELECT 
        e.id,
        e.nombre,
        e.grupo,
        tp.puntos,
        tp.partidos_jugados,
        tp.goles_a_favor,
        tp.goles_en_contra,
        (tp.goles_a_favor - tp.goles_en_contra) as diferencia_goles
      FROM tabla_posiciones tp
      JOIN equipos e ON tp.equipo_id = e.id
      WHERE (
        SELECT COUNT(*) 
        FROM tabla_posiciones tp2 
        WHERE tp2.grupo = tp.grupo 
        AND tp2.puntos > tp.puntos
      ) = 2
      ORDER BY tp.puntos DESC, (tp.goles_a_favor - tp.goles_en_contra) DESC
    `;

    const result = await client.query(query);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        terceros: result.rows.map((row, idx) => ({
          posicion: idx + 1,
          ...row
        }))
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.end();
  }
};
