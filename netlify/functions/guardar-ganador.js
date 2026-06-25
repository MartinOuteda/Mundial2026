const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { matchId, goles1, goles2 } = JSON.parse(event.body);

  if (!matchId || goles1 === undefined || goles2 === undefined) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan parámetros' }) };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    // 1. Obtener el partido específico para saber qué equipos juegan
    const queryMatch = `
      SELECT * FROM cuadro_eliminatorio 
      WHERE id = $1
    `;

    const resMatch = await client.query(queryMatch, [matchId]);
    if (resMatch.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Partido no encontrado' }) };
    }

    const match = resMatch.rows[0];

    // 2. Determinar ganador basado en goles
    let ganadorId = null;
    if (goles1 > goles2) {
      ganadorId = match.equipo_1_id;
    } else if (goles2 > goles1) {
      ganadorId = match.equipo_2_id;
    } else {
      // En caso de empate, por ahora no hay ganador definido
      // (En partidos de eliminación real hay penales, pero eso es opcional)
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Debe haber ganador (no puede ser empate)' }) 
      };
    }

    // 3. Actualizar SOLO este partido con los goles y el ganador
    const updateQuery = `
      UPDATE cuadro_eliminatorio 
      SET goles_1 = $1, goles_2 = $2, ganador_id = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const updateResult = await client.query(updateQuery, [goles1, goles2, ganadorId, matchId]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        match: updateResult.rows[0]
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.end();
  }
};
