const { Client } = require('pg');

exports.handler = async (event) => {
  try {
    const { grupo, equipo1, equipo2, goles1, goles2 } = JSON.parse(event.body);

    if (!grupo || !equipo1 || !equipo2 || goles1 === undefined || goles2 === undefined) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Datos incompletos' })
      };
    }

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    // Obtener IDs de equipos
    const eq1Result = await client.query(
      'SELECT id FROM equipos WHERE nombre = $1',
      [equipo1]
    );
    const eq2Result = await client.query(
      'SELECT id FROM equipos WHERE nombre = $1',
      [equipo2]
    );

    if (!eq1Result.rows.length || !eq2Result.rows.length) {
      await client.end();
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Equipos no encontrados' })
      };
    }

    const id1 = eq1Result.rows[0].id;
    const id2 = eq2Result.rows[0].id;

    // Actualizar partido
    await client.query(
      `UPDATE partidos_grupos 
       SET goles_1 = $1, goles_2 = $2
       WHERE grupo = $3 AND 
         ((equipo_1_id = $4 AND equipo_2_id = $5) OR 
          (equipo_1_id = $5 AND equipo_2_id = $4))`,
      [goles1, goles2, grupo, id1, id2]
    );

    // Recalcular tabla de posiciones
    const tablaResult = await client.query(
      `SELECT equipo_id FROM tabla_posiciones WHERE grupo = $1`,
      [grupo]
    );

    for (const row of tablaResult.rows) {
      const equipoId = row.equipo_id;

      const statsResult = await client.query(
        `SELECT 
           COUNT(*) FILTER (WHERE goles_1 IS NOT NULL AND goles_2 IS NOT NULL) as pj,
           COUNT(*) FILTER (WHERE goles_1 IS NOT NULL AND goles_2 IS NOT NULL AND 
             ((equipo_1_id = $1 AND goles_1 > goles_2) OR (equipo_2_id = $1 AND goles_2 > goles_1))) as v,
           COUNT(*) FILTER (WHERE goles_1 IS NOT NULL AND goles_2 IS NOT NULL AND 
             goles_1 = goles_2 AND (equipo_1_id = $1 OR equipo_2_id = $1)) as e,
           COUNT(*) FILTER (WHERE goles_1 IS NOT NULL AND goles_2 IS NOT NULL AND 
             ((equipo_1_id = $1 AND goles_1 < goles_2) OR (equipo_2_id = $1 AND goles_2 < goles_1))) as d,
           COALESCE(SUM(CASE WHEN equipo_1_id = $1 THEN goles_1 WHEN equipo_2_id = $1 THEN goles_2 ELSE 0 END) FILTER (WHERE goles_1 IS NOT NULL AND goles_2 IS NOT NULL), 0) as gf,
           COALESCE(SUM(CASE WHEN equipo_1_id = $1 THEN goles_2 WHEN equipo_2_id = $1 THEN goles_1 ELSE 0 END) FILTER (WHERE goles_1 IS NOT NULL AND goles_2 IS NOT NULL), 0) as gc
         FROM partidos_grupos 
         WHERE grupo = $2 AND (equipo_1_id = $1 OR equipo_2_id = $1)`,
        [equipoId, grupo]
      );

      const stats = statsResult.rows[0];
      const pj = parseInt(stats.pj) || 0;
      const v = parseInt(stats.v) || 0;
      const e = parseInt(stats.e) || 0;
      const d = parseInt(stats.d) || 0;
      const gf = parseInt(stats.gf) || 0;
      const gc = parseInt(stats.gc) || 0;
      const puntos = v * 3 + e * 1;

      await client.query(
        `UPDATE tabla_posiciones 
         SET partidos_jugados = $1, victorias = $2, empates = $3, derrotas = $4, 
             goles_a_favor = $5, goles_en_contra = $6, puntos = $7
         WHERE equipo_id = $8`,
        [pj, v, e, d, gf, gc, puntos, equipoId]
      );
    }

    await client.end();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Resultado guardado' })
    };

  } catch (error) {
    console.error('Error:', error.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
