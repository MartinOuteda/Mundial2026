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

    // 1. Obtener 1ros y 2dos de cada grupo
    const queryPrimerosSegundos = `
      WITH ranked AS (
        SELECT 
          e.id,
          e.nombre,
          e.pais_codigo,
          e.grupo,
          tp.puntos,
          tp.goles_a_favor,
          tp.goles_en_contra,
          ROW_NUMBER() OVER (
            PARTITION BY tp.grupo 
            ORDER BY tp.puntos DESC, (tp.goles_a_favor - tp.goles_en_contra) DESC
          ) as posicion
        FROM tabla_posiciones tp
        JOIN equipos e ON tp.equipo_id = e.id
      )
      SELECT * FROM ranked WHERE posicion IN (1, 2)
      ORDER BY grupo, posicion
    `;

    // 2. Obtener los 8 mejores terceros
    const queryTerceros = `
      WITH ranked AS (
        SELECT 
          e.id,
          e.nombre,
          e.pais_codigo,
          e.grupo,
          tp.puntos,
          tp.goles_a_favor,
          tp.goles_en_contra,
          ROW_NUMBER() OVER (
            PARTITION BY tp.grupo 
            ORDER BY tp.puntos DESC, (tp.goles_a_favor - tp.goles_en_contra) DESC
          ) as posicion
        FROM tabla_posiciones tp
        JOIN equipos e ON tp.equipo_id = e.id
      )
      SELECT id, nombre, pais_codigo
      FROM ranked
      WHERE posicion = 3
      ORDER BY puntos DESC, (goles_a_favor - goles_en_contra) DESC
      LIMIT 8
    `;

    // 3. Obtener matches existentes del cuadro
    const queryMatches = `
      SELECT * FROM cuadro_eliminatorio
      ORDER BY id
    `;

    const [resPrimerosSegundos, resTerceros, resMatches] = await Promise.all([
      client.query(queryPrimerosSegundos),
      client.query(queryTerceros),
      client.query(queryMatches)
    ]);

    const primerosSegundos = resPrimerosSegundos.rows;
    const terceros = resTerceros.rows;
    const matches = resMatches.rows;

    // Crear mapas para fácil acceso
    const mapEquipos = {};
    primerosSegundos.forEach(eq => {
      mapEquipos[`${eq.grupo}${eq.posicion}`] = eq;
    });
    terceros.forEach((eq, idx) => {
      mapEquipos[`T${idx + 1}`] = eq;
    });

    // Emparejamientos del Round of 32 (según FIFA World Cup 2026)
    const emparejamientos = [
      ['E', 1, 'T', 1],      // 1° E vs Mejor T
      ['I', 1, 'T', 2],      // 1° I vs Mejor T
      ['A', 2, 'B', 2],      // 2° A vs 2° B
      ['F', 1, 'C', 2],      // 1° F vs 2° C
      ['K', 2, 'L', 2],      // 2° K vs 2° L
      ['H', 1, 'J', 2],      // 1° H vs 2° J
      ['D', 1, 'T', 3],      // 1° D vs Mejor T
      ['G', 1, 'T', 4],      // 1° G vs Mejor T
      ['C', 1, 'F', 2],      // 1° C vs 2° F
      ['E', 2, 'I', 2],      // 2° E vs 2° I
      ['A', 1, 'T', 5],      // 1° A vs Mejor T
      ['L', 1, 'T', 6],      // 1° L vs Mejor T
      ['J', 1, 'H', 2],      // 1° J vs 2° H
      ['D', 2, 'G', 2],      // 2° D vs 2° G
      ['B', 1, 'T', 7],      // 1° B vs Mejor T
      ['K', 1, 'T', 8]       // 1° K vs Mejor T
    ];

    // Función para construir match
    const buildMatch = (matchId, equipo1Key, equipo2Key) => {
      const eq1 = mapEquipos[equipo1Key];
      const eq2 = mapEquipos[equipo2Key];
      const existingMatch = matches.find(m => m.id === matchId);

      return {
        id: matchId,
        equipo_1_id: eq1?.id || null,
        equipo_1: eq1?.nombre || null,
        codigo_1: eq1?.pais_codigo || null,
        bandera_1: eq1 ? (BANDERAS[eq1.pais_codigo] || 'https://flagcdn.com/w40/un.png') : null,
        equipo_2_id: eq2?.id || null,
        equipo_2: eq2?.nombre || null,
        codigo_2: eq2?.pais_codigo || null,
        bandera_2: eq2 ? (BANDERAS[eq2.pais_codigo] || 'https://flagcdn.com/w40/un.png') : null,
        goles_1: existingMatch?.goles_1 ?? null,
        goles_2: existingMatch?.goles_2 ?? null,
        ganador_id: existingMatch?.ganador_id ?? null
      };
    };

    // Construir Round of 32
    const roundOf32 = emparejamientos.map((emp, idx) => {
      const eq1Key = `${emp[0]}${emp[1]}`;
      const eq2Key = emp[2] === 'T' ? `T${emp[3]}` : `${emp[2]}${emp[3]}`;
      return buildMatch(idx + 1, eq1Key, eq2Key);
    });

    // TODO: Construir Round of 16, QF, SF, Final basados en ganadores de Round of 32
    const roundOf16 = [];
    
    // Mapeo de qué partidos del RO32 generan qué partidos del RO16
    const emparejamientosRO16 = [
      [1, 5],      // Ganador(1) vs Ganador(5)
      [2, 6],      // Ganador(2) vs Ganador(6)
      [3, 4],      // Ganador(3) vs Ganador(4)
      [7, 15],     // Ganador(7) vs Ganador(15)
      [8, 16],     // Ganador(8) vs Ganador(16)
      [9, 13],     // Ganador(9) vs Ganador(13)
      [10, 14],    // Ganador(10) vs Ganador(14)
      [11, 12]     // Ganador(11) vs Ganador(12)
    ];

    // Construir Round of 16
    emparejamientosRO16.forEach((pareja, idx) => {
      const match1 = roundOf32.find(m => m.id === pareja[0]);
      const match2 = roundOf32.find(m => m.id === pareja[1]);
      
      const existingMatch = matches.find(m => m.id === (100 + idx + 1));
      
      roundOf16.push({
        id: 100 + idx + 1,
        equipo_1_id: match1?.ganador_id || null,
        equipo_1: match1?.ganador_id === match1?.equipo_1_id ? match1?.equipo_1 : match1?.equipo_2,
        codigo_1: match1?.ganador_id === match1?.equipo_1_id ? match1?.codigo_1 : match1?.codigo_2,
        bandera_1: match1?.ganador_id === match1?.equipo_1_id ? match1?.bandera_1 : match1?.bandera_2,
        equipo_2_id: match2?.ganador_id || null,
        equipo_2: match2?.ganador_id === match2?.equipo_1_id ? match2?.equipo_1 : match2?.equipo_2,
        codigo_2: match2?.ganador_id === match2?.equipo_1_id ? match2?.codigo_1 : match2?.codigo_2,
        bandera_2: match2?.ganador_id === match2?.equipo_1_id ? match2?.bandera_1 : match2?.bandera_2,
        goles_1: existingMatch?.goles_1 ?? null,
        goles_2: existingMatch?.goles_2 ?? null,
        ganador_id: existingMatch?.ganador_id ?? null
      });
    });

    const quarterfinals = [];
    const semifinals = [];
    const final = null;
    const thirdPlace = null;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roundOf32,
        roundOf16,
        quarterfinals,
        semifinals,
        final,
        thirdPlace
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
