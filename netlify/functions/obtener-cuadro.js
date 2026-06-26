const { Client } = require('pg');

const BANDERAS = {
  'ALE': 'https://flagcdn.com/w40/de.png',
  'BIH': 'https://flagcdn.com/w40/ba.png',
  'FRA': 'https://flagcdn.com/w40/fr.png',
  'SUE': 'https://flagcdn.com/w40/se.png',
  'ALE': 'https://flagcdn.com/w40/de.png',
  'ECU': 'https://flagcdn.com/w40/ec.png',
  'ALB': 'https://flagcdn.com/w40/al.png',
  'ESP': 'https://flagcdn.com/w40/es.png',
  'ITA': 'https://flagcdn.com/w40/it.png',
  'HUN': 'https://flagcdn.com/w40/hu.png',
  'SRB': 'https://flagcdn.com/w40/rs.png',
  'ROU': 'https://flagcdn.com/w40/ro.png',
  'GRE': 'https://flagcdn.com/w40/gr.png',
  'CHE': 'https://flagcdn.com/w40/ch.png',
  'POL': 'https://flagcdn.com/w40/pl.png',
  'POR': 'https://flagcdn.com/w40/pt.png',
  'GHA': 'https://flagcdn.com/w40/gh.png',
  'BRA': 'https://flagcdn.com/w40/br.png',
  'JPN': 'https://flagcdn.com/w40/jp.png',
  'ARG': 'https://flagcdn.com/w40/ar.png',
  'URU': 'https://flagcdn.com/w40/uy.png',
  'USA': 'https://flagcdn.com/w40/us.png',
  'CAN': 'https://flagcdn.com/w40/ca.png',
  'CRC': 'https://flagcdn.com/w40/cr.png',
  'MEX': 'https://flagcdn.com/w40/mx.png',
  'EGI': 'https://flagcdn.com/w40/eg.png',
  'ESC': 'https://flagcdn.com/w40/gb-sct.png',
  'COL': 'https://flagcdn.com/w40/co.png',
  'CRO': 'https://flagcdn.com/w40/hr.png',
  'PB': 'https://flagcdn.com/w40/nl.png',
  'MAR': 'https://flagcdn.com/w40/ma.png',
  'PAR': 'https://flagcdn.com/w40/py.png',
  'ARL': 'https://flagcdn.com/w40/dz.png',
  'CDS': 'https://flagcdn.com/w40/kr.png',
  'AUS': 'https://flagcdn.com/w40/au.png',
  'IRN': 'https://flagcdn.com/w40/ir.png',
};

exports.handler = async (event) => {
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL
    });

    await client.connect();

    // Obtener todos los datos necesarios
    const matchesResult = await client.query('SELECT * FROM cuadro_eliminatorio WHERE fase = \'RO32\' ORDER BY id');
    const equiposResult = await client.query('SELECT * FROM equipos');
    const tercerosResult = await client.query(
      'SELECT id, equipo FROM tabla_posiciones WHERE indice_orden IS NOT NULL ORDER BY indice_orden ASC'
    );

    const matches = matchesResult.rows;
    const equipos = equiposResult.rows;
    const terceros = tercerosResult.rows;

    // Mapeo de IDs partidos con terceros y su índice de tercero
    const partidosConTerceros = {
      17: 0, // T1
      18: 1, // T2
      23: 2, // T3
      24: 3, // T4
      27: 4, // T5
      28: 5, // T6
      31: 6, // T7
      32: 7  // T8
    };

    const buildMatch = (matchId, eq1Key, eq2Key) => {
      let eq1 = equipos.find(e => e.codigo === eq1Key);
      let eq2 = equipos.find(e => e.codigo === eq2Key);

      return {
        id: matchId,
        equipo_1_id: eq1?.id,
        equipo_1: eq1?.equipo,
        codigo_1: eq1?.codigo,
        bandera_1: BANDERAS[eq1?.codigo] || null,
        equipo_2_id: eq2?.id,
        equipo_2: eq2?.equipo,
        codigo_2: eq2?.codigo,
        bandera_2: BANDERAS[eq2?.codigo] || null
      };
    };

    const emparejamientos = [
      ['E', 1, 'T', 1], ['I', 1, 'T', 2], ['A', 2, 'B', 2], ['F', 1, 'C', 2],
      ['K', 2, 'L', 2], ['H', 1, 'J', 2], ['D', 1, 'T', 3], ['G', 1, 'T', 4],
      ['C', 1, 'F', 2], ['E', 2, 'I', 2], ['A', 1, 'T', 5], ['L', 1, 'T', 6],
      ['J', 1, 'H', 2], ['D', 2, 'G', 2], ['B', 1, 'T', 7], ['K', 1, 'T', 8]
    ];

    const roundOf32 = emparejamientos.map((emp, idx) => {
      const eq1Key = `${emp[0]}${emp[1]}`;
      const realMatchId = 17 + idx;
      const existingMatch = matches.find(m => m.id === realMatchId);

      let baseMatch = buildMatch(realMatchId, eq1Key, null);

      // Si es un partido con tercero, asignar el tercero correspondiente
      if (partidosConTerceros.hasOwnProperty(realMatchId)) {
        const terceroIdx = partidosConTerceros[realMatchId];
        if (terceros[terceroIdx]) {
          const terceroEquipo = equipos.find(e => e.id === terceros[terceroIdx].id);
          baseMatch.equipo_2_id = terceroEquipo?.id;
          baseMatch.equipo_2 = terceroEquipo?.equipo;
          baseMatch.codigo_2 = terceroEquipo?.codigo;
          baseMatch.bandera_2 = BANDERAS[terceroEquipo?.codigo] || null;
        }
      } else {
        // Partidos normales sin tercero
        const eq2Key = emp[2] === 'T' ? `T${emp[3]}` : `${emp[2]}${emp[3]}`;
        const eq2 = equipos.find(e => e.codigo === eq2Key);
        baseMatch.equipo_2_id = eq2?.id;
        baseMatch.equipo_2 = eq2?.equipo;
        baseMatch.codigo_2 = eq2?.codigo;
        baseMatch.bandera_2 = BANDERAS[eq2?.codigo] || null;
      }

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
        goles_1: existingMatch?.goles_1 || null,
        goles_2: existingMatch?.goles_2 || null,
        ganador_id: ganador_id,
        fecha_hora: existingMatch?.fecha_hora || null
      };
    });

    // Construir RO16 desde ganadores de RO32
    const roundOf16 = [];
    for (let i = 0; i < 8; i++) {
      const match1 = roundOf32[i * 2];
      const match2 = roundOf32[i * 2 + 1];

      const eq1 = match1.ganador_id ? 
        equipos.find(e => e.id === match1.ganador_id) : null;
      const eq2 = match2.ganador_id ? 
        equipos.find(e => e.id === match2.ganador_id) : null;

      roundOf16.push({
        id: 33 + i,
        equipo_1: eq1?.equipo || 'A definir',
        equipo_1_id: eq1?.id || null,
        codigo_1: eq1?.codigo,
        bandera_1: eq1 ? BANDERAS[eq1.codigo] : null,
        equipo_2: eq2?.equipo || 'A definir',
        equipo_2_id: eq2?.id || null,
        codigo_2: eq2?.codigo,
        bandera_2: eq2 ? BANDERAS[eq2.codigo] : null,
        ganador_id: null,
        goles_1: null,
        goles_2: null,
        fecha_hora: null
      });
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({
        roundOf32,
        roundOf16
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
