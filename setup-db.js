#!/usr/bin/env node
const { Client } = require('pg');

// Usar DATABASE_URL directamente de la variable de entorno
const DATABASE_URL = 'postgresql://neondb_owner:npg_jfOq0lI5wiQt@ep-billowing-mountain-aig7zseh-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const equipos = {
  A: [
    { nombre: 'Argentina', codigo: 'ARG' },
    { nombre: 'Paraguay', codigo: 'PAR' },
    { nombre: 'Canadá', codigo: 'CAN' },
    { nombre: 'Marruecos', codigo: 'MAR' }
  ],
  B: [
    { nombre: 'Francia', codigo: 'FRA' },
    { nombre: 'Uruguay', codigo: 'URU' },
    { nombre: 'Dinamarca', codigo: 'DIN' },
    { nombre: 'Kazajstán', codigo: 'KAZ' }
  ],
  C: [
    { nombre: 'España', codigo: 'ESP' },
    { nombre: 'Países Bajos', codigo: 'HOL' },
    { nombre: 'Chile', codigo: 'CHI' },
    { nombre: 'Perú', codigo: 'PER' }
  ],
  D: [
    { nombre: 'Alemania', codigo: 'ALE' },
    { nombre: 'México', codigo: 'MEX' },
    { nombre: 'Polonia', codigo: 'POL' },
    { nombre: 'Uzbekistán', codigo: 'UZB' }
  ],
  E: [
    { nombre: 'Brasil', codigo: 'BRA' },
    { nombre: 'Portugal', codigo: 'POR' },
    { nombre: 'Irán', codigo: 'IRN' },
    { nombre: 'Hong Kong', codigo: 'HKG' }
  ],
  F: [
    { nombre: 'Bélgica', codigo: 'BEL' },
    { nombre: 'Croacia', codigo: 'CRO' },
    { nombre: 'Camerún', codigo: 'CAM' },
    { nombre: 'Canadá', codigo: 'CAN' }
  ],
  G: [
    { nombre: 'Italia', codigo: 'ITA' },
    { nombre: 'Suiza', codigo: 'SUI' },
    { nombre: 'Costa Rica', codigo: 'CRC' },
    { nombre: 'Tailandia', codigo: 'TAI' }
  ],
  H: [
    { nombre: 'Japón', codigo: 'JAP' },
    { nombre: 'Australia', codigo: 'AUS' },
    { nombre: 'Corea del Sur', codigo: 'COR' },
    { nombre: 'Arabia Saudita', codigo: 'ARS' }
  ]
};

const partidos = {
  A: [
    { jornada: 1, equipo1: 'Argentina', equipo2: 'Canadá' },
    { jornada: 1, equipo1: 'Paraguay', equipo2: 'Marruecos' },
    { jornada: 2, equipo1: 'Argentina', equipo2: 'Paraguay' },
    { jornada: 2, equipo1: 'Canadá', equipo2: 'Marruecos' },
    { jornada: 3, equipo1: 'Argentina', equipo2: 'Marruecos' },
    { jornada: 3, equipo1: 'Canadá', equipo2: 'Paraguay' }
  ],
  B: [
    { jornada: 1, equipo1: 'Francia', equipo2: 'Kazajstán' },
    { jornada: 1, equipo1: 'Uruguay', equipo2: 'Dinamarca' },
    { jornada: 2, equipo1: 'Francia', equipo2: 'Uruguay' },
    { jornada: 2, equipo1: 'Dinamarca', equipo2: 'Kazajstán' },
    { jornada: 3, equipo1: 'Francia', equipo2: 'Dinamarca' },
    { jornada: 3, equipo1: 'Uruguay', equipo2: 'Kazajstán' }
  ],
  C: [
    { jornada: 1, equipo1: 'España', equipo2: 'Perú' },
    { jornada: 1, equipo1: 'Países Bajos', equipo2: 'Chile' },
    { jornada: 2, equipo1: 'España', equipo2: 'Países Bajos' },
    { jornada: 2, equipo1: 'Perú', equipo2: 'Chile' },
    { jornada: 3, equipo1: 'España', equipo2: 'Chile' },
    { jornada: 3, equipo1: 'Países Bajos', equipo2: 'Perú' }
  ],
  D: [
    { jornada: 1, equipo1: 'Alemania', equipo2: 'Uzbekistán' },
    { jornada: 1, equipo1: 'México', equipo2: 'Polonia' },
    { jornada: 2, equipo1: 'Alemania', equipo2: 'México' },
    { jornada: 2, equipo1: 'Polonia', equipo2: 'Uzbekistán' },
    { jornada: 3, equipo1: 'Alemania', equipo2: 'Polonia' },
    { jornada: 3, equipo1: 'México', equipo2: 'Uzbekistán' }
  ],
  E: [
    { jornada: 1, equipo1: 'Brasil', equipo2: 'Hong Kong' },
    { jornada: 1, equipo1: 'Portugal', equipo2: 'Irán' },
    { jornada: 2, equipo1: 'Brasil', equipo2: 'Portugal' },
    { jornada: 2, equipo1: 'Irán', equipo2: 'Hong Kong' },
    { jornada: 3, equipo1: 'Brasil', equipo2: 'Irán' },
    { jornada: 3, equipo1: 'Portugal', equipo2: 'Hong Kong' }
  ],
  F: [
    { jornada: 1, equipo1: 'Bélgica', equipo2: 'Camerún' },
    { jornada: 1, equipo1: 'Croacia', equipo2: 'Canadá' },
    { jornada: 2, equipo1: 'Bélgica', equipo2: 'Croacia' },
    { jornada: 2, equipo1: 'Canadá', equipo2: 'Camerún' },
    { jornada: 3, equipo1: 'Bélgica', equipo2: 'Canadá' },
    { jornada: 3, equipo1: 'Croacia', equipo2: 'Camerún' }
  ],
  G: [
    { jornada: 1, equipo1: 'Italia', equipo2: 'Tailandia' },
    { jornada: 1, equipo1: 'Suiza', equipo2: 'Costa Rica' },
    { jornada: 2, equipo1: 'Italia', equipo2: 'Suiza' },
    { jornada: 2, equipo1: 'Costa Rica', equipo2: 'Tailandia' },
    { jornada: 3, equipo1: 'Italia', equipo2: 'Costa Rica' },
    { jornada: 3, equipo1: 'Suiza', equipo2: 'Tailandia' }
  ],
  H: [
    { jornada: 1, equipo1: 'Japón', equipo2: 'Arabia Saudita' },
    { jornada: 1, equipo1: 'Australia', equipo2: 'Corea del Sur' },
    { jornada: 2, equipo1: 'Japón', equipo2: 'Australia' },
    { jornada: 2, equipo1: 'Corea del Sur', equipo2: 'Arabia Saudita' },
    { jornada: 3, equipo1: 'Japón', equipo2: 'Corea del Sur' },
    { jornada: 3, equipo1: 'Australia', equipo2: 'Arabia Saudita' }
  ]
};

async function setupDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✓ Conectado a Neon\n');

    // 1. Limpiar datos existentes
    console.log('📦 Limpiando datos anteriores...');
    await client.query('DROP TABLE IF EXISTS cuadro_eliminatorio CASCADE');
    await client.query('DROP TABLE IF EXISTS terceros_clasificados CASCADE');
    await client.query('DROP TABLE IF EXISTS tabla_posiciones CASCADE');
    await client.query('DROP TABLE IF EXISTS partidos_grupos CASCADE');
    await client.query('DROP TABLE IF EXISTS equipos CASCADE');
    console.log('✓ Tablas eliminadas\n');

    // 2. Crear tablas
    console.log('🗄️ Creando tablas...');
    
    await client.query(`
      CREATE TABLE equipos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL UNIQUE,
        grupo CHAR(1) NOT NULL,
        pais_codigo CHAR(2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE partidos_grupos (
        id SERIAL PRIMARY KEY,
        equipo_1_id INTEGER NOT NULL REFERENCES equipos(id),
        equipo_2_id INTEGER NOT NULL REFERENCES equipos(id),
        goles_1 INTEGER,
        goles_2 INTEGER,
        grupo CHAR(1) NOT NULL,
        jornada INTEGER NOT NULL,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE tabla_posiciones (
        id SERIAL PRIMARY KEY,
        equipo_id INTEGER NOT NULL REFERENCES equipos(id),
        grupo CHAR(1) NOT NULL,
        partidos_jugados INTEGER DEFAULT 0,
        victorias INTEGER DEFAULT 0,
        empates INTEGER DEFAULT 0,
        derrotas INTEGER DEFAULT 0,
        goles_a_favor INTEGER DEFAULT 0,
        goles_en_contra INTEGER DEFAULT 0,
        puntos INTEGER DEFAULT 0,
        clasificado BOOLEAN DEFAULT FALSE,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE terceros_clasificados (
        id SERIAL PRIMARY KEY,
        equipo_id INTEGER NOT NULL REFERENCES equipos(id),
        grupo CHAR(1) NOT NULL,
        puntos INTEGER DEFAULT 0,
        diferencia_goles INTEGER DEFAULT 0,
        goles_a_favor INTEGER DEFAULT 0,
        clasificado BOOLEAN DEFAULT FALSE,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE cuadro_eliminatorio (
        id SERIAL PRIMARY KEY,
        fase VARCHAR(50) NOT NULL,
        partido_numero INTEGER NOT NULL,
        equipo_1_id INTEGER REFERENCES equipos(id),
        equipo_2_id INTEGER REFERENCES equipos(id),
        ganador_id INTEGER REFERENCES equipos(id),
        goles_1 INTEGER,
        goles_2 INTEGER,
        actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear índices
    await client.query('CREATE INDEX idx_equipos_grupo ON equipos(grupo)');
    await client.query('CREATE INDEX idx_partidos_grupo ON partidos_grupos(grupo)');
    await client.query('CREATE INDEX idx_tabla_grupo ON tabla_posiciones(grupo)');
    await client.query('CREATE INDEX idx_cuadro_fase ON cuadro_eliminatorio(fase)');

    console.log('✓ Tablas creadas\n');

    // 3. Cargar equipos
    console.log('⚽ Cargando 32 equipos...');
    let contEquipos = 0;
    for (const [grupo, listaEquipos] of Object.entries(equipos)) {
      for (const equipo of listaEquipos) {
        await client.query(
          'INSERT INTO equipos (nombre, grupo, pais_codigo) VALUES ($1, $2, $3)',
          [equipo.nombre, grupo, equipo.codigo]
        );
        contEquipos++;
      }
    }
    console.log(`✓ ${contEquipos} equipos cargados\n`);

    // 4. Cargar partidos
    console.log('🏟️ Cargando partidos de grupos...');
    let contPartidos = 0;
    for (const [grupo, listaPartidos] of Object.entries(partidos)) {
      for (const partido of listaPartidos) {
        const eq1 = await client.query(
          'SELECT id FROM equipos WHERE nombre = $1',
          [partido.equipo1]
        );
        const eq2 = await client.query(
          'SELECT id FROM equipos WHERE nombre = $1',
          [partido.equipo2]
        );

        if (eq1.rows.length && eq2.rows.length) {
          await client.query(
            `INSERT INTO partidos_grupos (equipo_1_id, equipo_2_id, grupo, jornada) 
             VALUES ($1, $2, $3, $4)`,
            [eq1.rows[0].id, eq2.rows[0].id, grupo, partido.jornada]
          );
          contPartidos++;
        }
      }
    }
    console.log(`✓ ${contPartidos} partidos de grupos cargados\n`);

    // 5. Cargar cuadro eliminatorio
    console.log('🏆 Creando estructura cuadro eliminatorio...');
    const fases = [
      { nombre: 'Round of 16', partidos: 8 },
      { nombre: 'Quarterfinals', partidos: 4 },
      { nombre: 'Semifinals', partidos: 2 },
      { nombre: 'Final', partidos: 1 },
      { nombre: 'Third Place', partidos: 1 }
    ];

    let contCuadro = 0;
    for (const fase of fases) {
      for (let i = 1; i <= fase.partidos; i++) {
        await client.query(
          `INSERT INTO cuadro_eliminatorio (fase, partido_numero) 
           VALUES ($1, $2)`,
          [fase.nombre, i]
        );
        contCuadro++;
      }
    }
    console.log(`✓ ${contCuadro} partidos del cuadro creados\n`);

    console.log('✅ BASE DE DATOS CONFIGURADA EXITOSAMENTE\n');
    console.log('📊 RESUMEN:');
    console.log('   • 32 equipos en 8 grupos');
    console.log('   • 48 partidos de fase de grupos');
    console.log('   • 16 partidos del cuadro eliminatorio');
    console.log('   • 1 partido de tercer puesto\n');
    console.log('🚀 Listo para comenzar:\n');
    console.log('   npm run dev\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
