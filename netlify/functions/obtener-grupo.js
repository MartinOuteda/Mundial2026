const { Client } = require('pg');

exports.handler = async (event) => {
  console.log('Iniciando obtener-grupo');
  
  try {
    const grupo = event.queryStringParameters?.grupo;
    
    if (!grupo) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Grupo requerido' })
      };
    }

    if (!process.env.DATABASE_URL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'DATABASE_URL no configurada' })
      };
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    const partidos = await client.query(
      `SELECT e1.nombre as equipo1, e2.nombre as equipo2, pg.goles_1, pg.goles_2, pg.jornada
       FROM partidos_grupos pg
       JOIN equipos e1 ON pg.equipo_1_id = e1.id
       JOIN equipos e2 ON pg.equipo_2_id = e2.id
       WHERE pg.grupo = $1
       ORDER BY pg.jornada`,
      [grupo]
    );

    const tabla = await client.query(
      `SELECT e.nombre, tp.partidos_jugados, tp.victorias, tp.empates, tp.derrotas, 
              tp.goles_a_favor, tp.goles_en_contra, tp.puntos
       FROM tabla_posiciones tp
       JOIN equipos e ON tp.equipo_id = e.id
       WHERE tp.grupo = $1
       ORDER BY tp.puntos DESC`,
      [grupo]
    );

    await client.end();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grupo,
        partidos: partidos.rows,
        tabla: tabla.rows
      })
    };

  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      })
    };
  }
};
