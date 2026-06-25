const { Client } = require('pg');

// Mapeo de códigos de país a URLs de banderas
const BANDERAS = {
  'MEX': 'https://flagcdn.com/w40/mx.png',
  'SUD': 'https://flagcdn.com/w40/za.png',
  'COR': 'https://flagcdn.com/w40/kr.png',
  'CZE': 'https://flagcdn.com/w40/cz.png',
  'CAN': 'https://flagcdn.com/w40/ca.png',
  'BIH': 'https://flagcdn.com/w40/ba.png',
  'QAT': 'https://flagcdn.com/w40/qa.png',
  'SUI': 'https://flagcdn.com/w40/ch.png',
  'BRA': 'https://flagcdn.com/w40/br.png',
  'MAR': 'https://flagcdn.com/w40/ma.png',
  'HAI': 'https://flagcdn.com/w40/ht.png',
  'ESC': 'https://flagcdn.com/w40/gb-sct.png',
  'USA': 'https://flagcdn.com/w40/us.png',
  'PAR': 'https://flagcdn.com/w40/py.png',
  'AUS': 'https://flagcdn.com/w40/au.png',
  'TUR': 'https://flagcdn.com/w40/tr.png',
  'ALE': 'https://flagcdn.com/w40/de.png',
  'CUW': 'https://flagcdn.com/w40/cw.png',
  'CIV': 'https://flagcdn.com/w40/ci.png',
  'ECU': 'https://flagcdn.com/w40/ec.png',
  'HOL': 'https://flagcdn.com/w40/nl.png',
  'JAP': 'https://flagcdn.com/w40/jp.png',
  'SUE': 'https://flagcdn.com/w40/se.png',
  'TUN': 'https://flagcdn.com/w40/tn.png',
  'BEL': 'https://flagcdn.com/w40/be.png',
  'EGY': 'https://flagcdn.com/w40/eg.png',
  'IRN': 'https://flagcdn.com/w40/ir.png',
  'NZL': 'https://flagcdn.com/w40/nz.png',
  'ESP': 'https://flagcdn.com/w40/es.png',
  'CPV': 'https://flagcdn.com/w40/cv.png',
  'ARS': 'https://flagcdn.com/w40/sa.png',
  'URU': 'https://flagcdn.com/w40/uy.png',
  'FRA': 'https://flagcdn.com/w40/fr.png',
  'SEN': 'https://flagcdn.com/w40/sn.png',
  'IRQ': 'https://flagcdn.com/w40/iq.png',
  'NOR': 'https://flagcdn.com/w40/no.png',
  'ARG': 'https://flagcdn.com/w40/ar.png',
  'ALG': 'https://flagcdn.com/w40/dz.png',
  'AUT': 'https://flagcdn.com/w40/at.png',
  'JOR': 'https://flagcdn.com/w40/jo.png',
  'POR': 'https://flagcdn.com/w40/pt.png',
  'COG': 'https://flagcdn.com/w40/cg.png',
  'UZB': 'https://flagcdn.com/w40/uz.png',
  'COL': 'https://flagcdn.com/w40/co.png',
  'ING': 'https://flagcdn.com/w40/gb-eng.png',
  'CRO': 'https://flagcdn.com/w40/hr.png',
  'GHA': 'https://flagcdn.com/w40/gh.png',
  'PAN': 'https://flagcdn.com/w40/pa.png'
};

exports.handler = async (event) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    // Obtener el 3er clasificado de cada grupo usando ROW_NUMBER
    const query = `
      WITH ranked AS (
        SELECT 
          e.id,
          e.nombre,
          e.pais_codigo,
          e.grupo,
          tp.puntos,
          tp.partidos_jugados,
          tp.goles_a_favor,
          tp.goles_en_contra,
          (tp.goles_a_favor - tp.goles_en_contra) as diferencia_goles,
          ROW_NUMBER() OVER (
            PARTITION BY tp.grupo 
            ORDER BY tp.puntos DESC, (tp.goles_a_favor - tp.goles_en_contra) DESC
          ) as rank
        FROM tabla_posiciones tp
        JOIN equipos e ON tp.equipo_id = e.id
      )
      SELECT 
        id,
        nombre,
        pais_codigo,
        grupo,
        puntos,
        partidos_jugados,
        goles_a_favor,
        goles_en_contra,
        diferencia_goles
      FROM ranked
      WHERE rank = 3
      ORDER BY puntos DESC, diferencia_goles DESC
    `;

    const result = await client.query(query);

    console.log(`Encontrados ${result.rows.length} terceros clasificados`);

    const terceros = result.rows.map((row, idx) => ({
      posicion: idx + 1,
      ...row,
      bandera: BANDERAS[row.pais_codigo] || 'https://flagcdn.com/w40/un.png'
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        terceros: terceros,
        total: terceros.length
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
