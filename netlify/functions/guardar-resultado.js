import { guardarResultado } from '@/lib/db';

export default async function handler(req, res) {
  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { grupo, equipo1, equipo2, goles1, goles2 } = req.body;

    // Validar datos
    if (!grupo || !equipo1 || !equipo2 || goles1 === undefined || goles2 === undefined) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Convertir goles a números
    const g1 = parseInt(goles1) || 0;
    const g2 = parseInt(goles2) || 0;

    await guardarResultado(grupo, equipo1, equipo2, g1, g2);

    return res.status(200).json({ 
      success: true,
      message: 'Resultado guardado correctamente'
    });
  } catch (error) {
    console.error('Error en API:', error);
    return res.status(500).json({ error: 'Error al guardar el resultado' });
  }
}
