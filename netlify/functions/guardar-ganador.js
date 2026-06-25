const { Client } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const { matchId, goles1, goles2 } = JSON.parse(event.body);

  const matchIdInt = parseInt(matchId);
  const goles1Int = parseInt(goles1);
  const goles2Int = parseInt(goles2);

  if (!matchIdInt || goles1Int === undefined || goles2Int === undefined) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan parámetros válidos' }) };
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

    const resMatch = await client.query(queryMatch, [matchIdInt]);
    if (resMatch.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Partido no encontrado' }) };
    }

    const match = resMatch.rows[0];

    // 2. Determinar ganador basado en goles
    let ganadorId = null;
    if (goles1Int > goles2Int) {
      ganadorId = match.equipo_1_id;
    } else if (goles2Int > goles1Int) {
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
      SET goles_1 = $1, goles_2 = $2, ganador_id = $3
      WHERE id = $4
      RETURNING *
    `;

    const updateResult = await client.query(updateQuery, [goles1Int, goles2Int, ganadorId, matchIdInt]);

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
