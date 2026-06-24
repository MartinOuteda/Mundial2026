import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { grupo, equipo1, equipo2, goles1, goles2 } = req.body;

    if (!grupo || !equipo1 || !equipo2 || goles1 === undefined || goles2 === undefined) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    await client.connect();

    // 1. Obtener IDs de los equipos
    const eq1Result = await client.query(
      'SELECT id FROM equipos WHERE nombre = $1 AND grupo = $2',
      [equipo1, grupo]
    );
    const eq2Result = await client.query(
      'SELECT id FROM equipos WHERE nombre = $1 AND grupo = $2',
      [equipo2, grupo]
    );

    if (eq1Result.rows.length === 0 || eq2Result.rows.length === 0) {
      return res.status(400).json({ 
        error: 'Equipos no encontrados',
        equipo1: eq1Result.rows.length > 0 ? 'OK' : 'NO ENCONTRADO',
        equipo2: eq2Result.rows.length > 0 ? 'OK' : 'NO ENCONTRADO'
      });
    }

    const id1 = eq1Result.rows[0].id;
    const id2 = eq2Result.rows[0].id;

    // 2. Actualizar el partido
    const updateResult = await client.query(`
      UPDATE partidos_grupos 
      SET goles_1 = $1, goles_2 = $2, actualizado_en = CURRENT_TIMESTAMP
      WHERE grupo = $3 AND 
        ((equipo_1_id = $4 AND equipo_2_id = $5) OR 
         (equipo_1_id = $5 AND equipo_2_id = $4))
      RETURNING id
    `, [goles1, goles2, grupo, id1, id2]);

    if (updateResult.rows.length === 0) {
      return res.status(400).json({ error: 'Partido no actualizado. Verifica los equipos.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Resultado guardado correctamente',
      partidoId: updateResult.rows[0].id
    });

  } catch (error) {
    console.error('Error en guardar-resultado:', error);
    return res.status(500).json({ 
      error: 'Error al guardar', 
      detalle: error.message 
    });
  } finally {
    await client.end();
  }
}
