import { obtenerPartidos, obtenerTablaGrupo } from '@/lib/db';

export default async function handler(req, res) {
  const { grupo } = req.query;

  if (!grupo) {
    return res.status(400).json({ error: 'Grupo no especificado' });
  }

  try {
    const partidos = await obtenerPartidos(grupo);
    const tabla = await obtenerTablaGrupo(grupo);

    return res.status(200).json({
      grupo,
      partidos,
      tabla
    });
  } catch (error) {
    console.error('Error obteniendo datos del grupo:', error);
    return res.status(500).json({ error: 'Error al obtener datos' });
  }
}
