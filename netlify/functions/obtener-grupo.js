const { Client } = require('pg');

exports.handler = async (event) => {
  const grupo = event.queryStringParameters?.grupo;
  
  if (!grupo) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Grupo requerido' }) };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    // Obtener standings ordenados por puntos DESC, diferencia de goles DESC
    const queryTabla = `
      SELECT 
        tp.equipo_id,
        e.nombre,
        tp.puntos,
        tp.partidos_jugados,
        tp.goles_a_favor,
        tp.goles_en_contra,
        (tp.goles_a_favor - tp.goles_en_contra) as diferencia_goles
      FROM tabla_posiciones tp
      JOIN equipos e ON tp.equipo_id = e.id
      WHERE tp.grupo = $1
      ORDER BY tp.puntos DESC, (tp.goles_a_favor - tp.goles_en_contra) DESC, tp.goles_a_favor DESC
    `;

    // Obtener partidos del grupo
    const queryPartidos = `
      SELECT 
        pg.id,
        pg.equipo_1_id,
        pg.equipo_2_id,
        e1.nombre as equipo_1,
        e2.nombre as equipo_2,
        pg.goles_1,
        pg.goles_2,
        pg.jornada
      FROM partidos_grupos pg
      JOIN equipos e1 ON pg.equipo_1_id = e1.id
      JOIN equipos e2 ON pg.equipo_2_id = e2.id
      WHERE pg.grupo = $1
      ORDER BY pg.jornada ASC, pg.id ASC
    `;

    const [resultTabla, resultPartidos] = await Promise.all([
      client.query(queryTabla, [grupo]),
      client.query(queryPartidos, [grupo])
    ]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grupo,
        tabla: resultTabla.rows,
        partidos: resultPartidos.rows
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
