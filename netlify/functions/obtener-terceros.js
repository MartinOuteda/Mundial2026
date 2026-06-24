import { obtenerTerceros } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const terceros = await obtenerTerceros();
    return res.status(200).json(terceros);
  } catch (error) {
    console.error('Error obteniendo terceros:', error);
    return res.status(500).json({ error: 'Error al obtener datos' });
  }
}
