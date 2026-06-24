export default async function handler(req, res) {
  console.log('🔵 obtener-grupo iniciado');
  console.log('DATABASE_URL existe:', !!process.env.DATABASE_URL);
  
  try {
    const { grupo } = req.query;
    if (!grupo) {
      return res.status(400).json({ error: 'Grupo requerido' });
    }

    const { Client } = await import('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();
    console.log('✅ Conectado a BD');

    const partidos = await client.query(
      `SELECT e1.nombre as equipo1, e2.nombre as equipo2, pg.goles_1, pg.goles_2, pg.jornada
       FROM partidos_grupos pg
       JOIN equipos e1 ON pg.equipo_1_id = e1.id
       JOIN equipos e2 ON pg.equipo_2_id = e2.id
       WHERE pg.grupo = $1
       ORDER BY pg.jornada, pg.id`,
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
    
    return res.status(200).json({
      grupo,
      partidos: partidos.rows || [],
      tabla: tabla.rows || []
    });

  } catch (error) {
    console.error('❌ ERROR en obtener-grupo:', error.message);
    return res.status(500).json({ 
      error: error.message,
      type: error.constructor.name
    });
  }
}
