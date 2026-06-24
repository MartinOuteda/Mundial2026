import { Client } from 'pg';

async function conectarDB() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { partidoId, ganadorId } = req.body;

  if (!partidoId || !ganadorId) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const client = await conectarDB();

  try {
    // Actualizar ganador del partido
    const query = `
      UPDATE cuadro_eliminatorio 
      SET ganador_id = $1, actualizado_en = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;

    const resultado = await client.query(query, [ganadorId, partidoId]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Partido no encontrado' });
    }

    // TODO: Aquí podrías agregar lógica para propagar el ganador a la siguiente fase

    return res.status(200).json({
      success: true,
      message: 'Ganador guardado correctamente',
      partido: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error guardando ganador:', error);
    return res.status(500).json({ error: 'Error al guardar' });
  } finally {
    await client.end();
  }
}
