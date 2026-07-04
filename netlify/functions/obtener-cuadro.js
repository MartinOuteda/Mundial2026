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

    // 2. Obtener los terceros con índice de orden asignado manualmente (1 a 8).
    //    El cruce del Round of 32 se ubica según indice_orden, no por puntos.
    const queryTerceros = `
      WITH ranked AS (
        SELECT
          e.id,
          e.nombre,
          e.pais_codigo,
          e.grupo,
          tp.indice_orden,
          ROW_NUMBER() OVER (
            PARTITION BY tp.grupo
            ORDER BY tp.puntos DESC, (tp.goles_a_favor - tp.goles_en_contra) DESC
          ) as posicion
        FROM tabla_posiciones tp
        JOIN equipos e ON tp.equipo_id = e.id
      )
      SELECT id, nombre, pais_codigo, indice_orden
      FROM ranked
      WHERE posicion = 3 AND indice_orden BETWEEN 1 AND 8
      ORDER BY indice_orden
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
    // Ubicar cada tercero en su slot T1..T8 según el indice_orden guardado.
    // Si un índice no fue asignado, su slot queda vacío => "A definir" en el cuadro.
    terceros.forEach((eq) => {
      mapEquipos[`T${eq.indice_orden}`] = eq;
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
      
      const realMatchId = 17 + idx;
      const existingMatch = matches.find(m => m.id === realMatchId);
      
      const baseMatch = buildMatch(realMatchId, eq1Key, eq2Key);
      
      // Calcular ganador basado en goles
      let ganador_id = null;
      if (existingMatch?.goles_1 !== null && existingMatch?.goles_1 !== undefined && 
          existingMatch?.goles_2 !== null && existingMatch?.goles_2 !== undefined) {
        if (existingMatch.goles_1 > existingMatch.goles_2) {
          ganador_id = baseMatch.equipo_1_id;
        } else if (existingMatch.goles_2 > existingMatch.goles_1) {
          ganador_id = baseMatch.equipo_2_id;
        }
      }
      
      return {
        ...baseMatch,
        goles_1: existingMatch?.goles_1 ?? null,
        goles_2: existingMatch?.goles_2 ?? null,
        ganador_id: ganador_id,
        fecha_hora: existingMatch?.fecha_hora || null
      };
    });

    // Ganador (datos completos) de un partido ya construido, según sus goles.
    // Empate o gol faltante => null (=> "A definir" en la ronda siguiente).
    const getGanador = (match) => {
      if (!match) return null;
      const { goles_1, goles_2 } = match;
      if (goles_1 == null || goles_2 == null || goles_1 === goles_2) return null;
      const gana1 = goles_1 > goles_2;
      return {
        id: gana1 ? match.equipo_1_id : match.equipo_2_id,
        nombre: gana1 ? match.equipo_1 : match.equipo_2,
        codigo: gana1 ? match.codigo_1 : match.codigo_2,
        bandera: gana1 ? match.bandera_1 : match.bandera_2
      };
    };

    // Construye una ronda tomando los ganadores de la ronda anterior por pares.
    // idBase = id en cuadro_eliminatorio del primer partido de la ronda.
    const construirRonda = (rondaAnterior, faseNombre, idBase) => {
      const ronda = [];
      for (let i = 0; i < rondaAnterior.length; i += 2) {
        const g1 = getGanador(rondaAnterior[i]);
        const g2 = getGanador(rondaAnterior[i + 1]);
        const matchId = idBase + (i / 2);
        const existingMatch = matches.find(m => m.id === matchId);

        ronda.push({
          id: matchId,
          fase: faseNombre,
          partido_numero: (i / 2) + 1,
          equipo_1_id: g1?.id ?? null,
          equipo_1: g1?.nombre ?? null,
          codigo_1: g1?.codigo ?? null,
          bandera_1: g1?.bandera ?? null,
          equipo_2_id: g2?.id ?? null,
          equipo_2: g2?.nombre ?? null,
          codigo_2: g2?.codigo ?? null,
          bandera_2: g2?.bandera ?? null,
          goles_1: existingMatch?.goles_1 ?? null,
          goles_2: existingMatch?.goles_2 ?? null,
          fecha_hora: existingMatch?.fecha_hora ?? null
        });
      }
      return ronda;
    };

    // RO16 desde ganadores del RO32 (ids 33-40); QF (Eliminatoria de 8) desde
    // ganadores del RO16 (ids 41-44). El ganador se calcula de los goles.
    const roundOf16 = construirRonda(roundOf32, 'RO16', 33);
    const quarterfinals = construirRonda(roundOf16, 'QF', 41);
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
