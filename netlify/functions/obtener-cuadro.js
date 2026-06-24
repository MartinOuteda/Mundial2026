import { Client } from 'pg';

async function conectarDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const client = await conectarDB();

  try {
    const query = `
      SELECT 
        ce.id,
        ce.fase,
        ce.partido_numero as numero,
        e1.nombre as equipo1,
        e2.nombre as equipo2,
        eg.nombre as ganador,
        ce.goles_1,
        ce.goles_2,
        ce.equipo_1_id,
        ce.equipo_2_id,
        ce.ganador_id
      FROM cuadro_eliminatorio ce
      LEFT JOIN equipos e1 ON ce.equipo_1_id = e1.id
      LEFT JOIN equipos e2 ON ce.equipo_2_id = e2.id
      LEFT JOIN equipos eg ON ce.ganador_id = eg.id
      ORDER BY ce.fase, ce.partido_numero
    `;

    const resultado = await client.query(query);
    
    // Agrupar por fase
    const cuadro = {};
    resultado.rows.forEach(partido => {
      if (!cuadro[partido.fase]) {
        cuadro[partido.fase] = [];
      }
      cuadro[partido.fase].push(partido);
    });

    return res.status(200).json(cuadro);
  } catch (error) {
    console.error('Error obteniendo cuadro:', error);
    return res.status(500).json({ error: 'Error al obtener datos' });
  } finally {
    await client.end();
  }
}
