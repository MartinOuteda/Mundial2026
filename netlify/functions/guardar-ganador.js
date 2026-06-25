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
    console.log('Partido encontrado:', resMatch.rows[0]);
    
    if (resMatch.rows.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'Partido no encontrado' }) };
    }

    const match = resMatch.rows[0];

    // 2. Determinar ganador basado en goles
    let ganadorId = null;
    console.log(`Comparando: ${goles1Int} > ${goles2Int} ?`);
    
    if (goles1Int > goles2Int) {
      ganadorId = match.equipo_1_id;
      console.log(`Ganador: Equipo 1 (ID: ${ganadorId})`);
    } else if (goles2Int > goles1Int) {
      ganadorId = match.equipo_2_id;
      console.log(`Ganador: Equipo 2 (ID: ${ganadorId})`);
    } else {
      console.log('Empate detectado');
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

    console.log(`Guardando: goles_1=${goles1Int}, goles_2=${goles2Int}, ganador_id=${ganadorId}, match_id=${matchIdInt}`);
    const updateResult = await client.query(updateQuery, [goles1Int, goles2Int, ganadorId, matchIdInt]);
    console.log('Resultado de UPDATE:', updateResult.rows[0]);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        match: updateResult.rows[0]
      })
    };
  } catch (error) {
    console.error('Error completo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    await client.end();
  }
};
