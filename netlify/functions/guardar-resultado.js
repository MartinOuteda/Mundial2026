const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método no permitido' }) };
  }

  try {
    const { grupo, equipo1, equipo2, goles1, goles2 } = JSON.parse(event.body);

    if (!grupo || !equipo1 || !equipo2 || goles1 === undefined || goles2 === undefined) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Datos incompletos' }) };
    }

    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();

    // Obtener IDs de equipos
    const eq1 = await client.query(
      'SELECT id FROM equipos WHERE nombre = $1 AND grupo = $2',
      [equipo1, grupo]
    );
    const eq2 = await client.query(
      'SELECT id FROM equipos WHERE nombre = $1 AND grupo = $2',
      [equipo2, grupo]
    );

    if (eq1.rows.length === 0 || eq2.rows.length === 0) {
      await client.end();
      return { statusCode: 400, body: JSON.stringify({ error: 'Equipos no encontrados' }) };
    }

    // Actualizar partido
    const id1 = eq1.rows[0].id;
    const id2 = eq2.rows[0].id;
    
    await client.query(
      `UPDATE partidos_grupos 
       SET goles_1 = $1, goles_2 = $2, actualizado_en = CURRENT_TIMESTAMP
       WHERE grupo = $3 AND 
         ((equipo_1_id = $4 AND equipo_2_id = $5) OR 
          (equipo_1_id = $5 AND equipo_2_id = $4))`,
      [goles1, goles2, grupo, id1, id2]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Resultado guardado' })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
