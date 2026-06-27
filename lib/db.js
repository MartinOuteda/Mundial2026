import { Client } from 'pg';

export async function conectarDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  await client.connect();
  return client;
}

export async function guardarResultado(grupo, equipo1, equipo2, goles1, goles2) {
  const client = await conectarDB();
  
  try {
    // Guardar resultado del partido
    const query = `
      UPDATE partidos_grupos 
      SET goles_1 = $1, goles_2 = $2, actualizado_en = CURRENT_TIMESTAMP
      WHERE grupo = $3 AND (
        (equipo_1_id = (SELECT id FROM equipos WHERE nombre = $4) AND 
         equipo_2_id = (SELECT id FROM equipos WHERE nombre = $5))
        OR
        (equipo_1_id = (SELECT id FROM equipos WHERE nombre = $5) AND 
         equipo_2_id = (SELECT id FROM equipos WHERE nombre = $4))
      )
    `;
    
    await client.query(query, [goles1, goles2, grupo, equipo1, equipo2]);
    
    // Recalcular tabla de posiciones
    await recalcularTabla(client, grupo);
    
    return { success: true };
  } catch (error) {
    console.error('Error guardando resultado:', error);
    throw error;
  } finally {
    await client.end();
  }
}

export async function recalcularTabla(client, grupo) {
  // Preservar los índices de orden ya guardados (no se recalculan).
  // Se anclan a equipo_id porque el id de la fila cambia en cada DELETE/INSERT.
  const previos = await client.query(
    'SELECT equipo_id, indice_orden FROM tabla_posiciones WHERE grupo = $1 AND indice_orden IS NOT NULL',
    [grupo]
  );

  // Limpiar tabla anterior
  await client.query('DELETE FROM tabla_posiciones WHERE grupo = $1', [grupo]);

  // Calcular nuevos valores
  const query = `
    WITH resultados AS (
      SELECT 
        e1.id as equipo_id,
        e1.nombre,
        COUNT(*) as partidos,
        SUM(CASE WHEN pg.goles_1 > pg.goles_2 THEN 1 ELSE 0 END) +
        SUM(CASE WHEN pg.goles_2 > pg.goles_1 AND e1.id = pg.equipo_2_id THEN 1 ELSE 0 END) as victorias,
        SUM(CASE WHEN pg.goles_1 = pg.goles_2 THEN 1 ELSE 0 END) as empates,
        SUM(CASE WHEN pg.goles_1 < pg.goles_2 AND e1.id = pg.equipo_1_id THEN 1 ELSE 0 END) +
        SUM(CASE WHEN pg.goles_2 < pg.goles_1 AND e1.id = pg.equipo_2_id THEN 1 ELSE 0 END) as derrotas,
        SUM(CASE WHEN e1.id = pg.equipo_1_id THEN pg.goles_1 ELSE pg.goles_2 END) as goles_favor,
        SUM(CASE WHEN e1.id = pg.equipo_1_id THEN pg.goles_2 ELSE pg.goles_1 END) as goles_contra
      FROM equipos e1
      LEFT JOIN partidos_grupos pg ON (
        (e1.id = pg.equipo_1_id OR e1.id = pg.equipo_2_id) AND pg.grupo = $1
      )
      WHERE e1.grupo = $1
      GROUP BY e1.id, e1.nombre
    )
    INSERT INTO tabla_posiciones 
    (equipo_id, grupo, partidos_jugados, victorias, empates, derrotas, goles_a_favor, goles_en_contra, puntos)
    SELECT 
      equipo_id,
      $1,
      partidos,
      victorias,
      empates,
      derrotas,
      goles_favor,
      goles_contra,
      (victorias * 3) + empates as puntos
    FROM resultados
  `;
  
  await client.query(query, [grupo]);

  // Restaurar los índices de orden guardados
  for (const { equipo_id, indice_orden } of previos.rows) {
    await client.query(
      'UPDATE tabla_posiciones SET indice_orden = $1 WHERE grupo = $2 AND equipo_id = $3',
      [indice_orden, grupo, equipo_id]
    );
  }
}

export async function obtenerPartidos(grupo) {
  const client = await conectarDB();
  
  try {
    const query = `
      SELECT 
        e1.nombre as equipo1,
        e2.nombre as equipo2,
        pg.goles_1,
        pg.goles_2,
        pg.jornada
      FROM partidos_grupos pg
      JOIN equipos e1 ON pg.equipo_1_id = e1.id
      JOIN equipos e2 ON pg.equipo_2_id = e2.id
      WHERE pg.grupo = $1
      ORDER BY pg.jornada, pg.id
    `;
    
    const resultado = await client.query(query, [grupo]);
    return resultado.rows;
  } finally {
    await client.end();
  }
}

export async function obtenerTablaGrupo(grupo) {
  const client = await conectarDB();
  
  try {
    const query = `
      SELECT 
        e.nombre,
        tp.partidos_jugados,
        tp.victorias,
        tp.empates,
        tp.derrotas,
        tp.goles_a_favor,
        tp.goles_en_contra,
        tp.puntos,
        (tp.goles_a_favor - tp.goles_en_contra) as diferencia
      FROM tabla_posiciones tp
      JOIN equipos e ON tp.equipo_id = e.id
      WHERE tp.grupo = $1
      ORDER BY tp.puntos DESC, diferencia DESC, tp.goles_a_favor DESC
    `;
    
    const resultado = await client.query(query, [grupo]);
    return resultado.rows;
  } finally {
    await client.end();
  }
}

export async function obtenerTerceros() {
  const client = await conectarDB();
  
  try {
    const query = `
      SELECT 
        e.nombre,
        e.grupo,
        tc.puntos,
        tc.diferencia_goles,
        tc.goles_a_favor,
        tc.clasificado,
        ROW_NUMBER() OVER (ORDER BY tc.puntos DESC, tc.diferencia_goles DESC, tc.goles_a_favor DESC) as ranking
      FROM terceros_clasificados tc
      JOIN equipos e ON tc.equipo_id = e.id
      ORDER BY tc.puntos DESC, tc.diferencia_goles DESC, tc.goles_a_favor DESC
      LIMIT 8
    `;
    
    const resultado = await client.query(query);
    return resultado.rows;
  } finally {
    await client.end();
  }
}
