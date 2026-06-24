import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const terceros = await client.query(`
      SELECT 
        e.nombre,
        e.grupo,
        tp.partidos_jugados,
        tp.victorias,
        tp.empates,
        tp.derrotas,
        tp.goles_a_favor,
        tp.goles_en_contra,
        tp.puntos,
        (tp.goles_a_favor - tp.goles_en_contra) as diferencia_goles
      FROM tabla_posiciones tp
      JOIN equipos e ON tp.equipo_id = e.id
      WHERE tp.grupo IS NOT NULL
      ORDER BY tp.puntos DESC, diferencia_goles DESC, tp.goles_a_favor DESC
    `);

    return res.status(200).json(terceros.rows);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}
