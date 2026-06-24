#!/usr/bin/env node
/**
 * Script para cargar datos iniciales del Mundial 2026 en Neon
 * Uso: node scripts/cargar-datos.js
 */

const { Client } = require('pg');
const { equipos, partidos } = require('../lib/fixture');

async function cargarDatos() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✓ Conectado a la base de datos');

    // Limpiar datos existentes
    console.log('\n📦 Limpiando datos existentes...');
    await client.query('DELETE FROM cuadro_eliminatorio');
    await client.query('DELETE FROM terceros_clasificados');
    await client.query('DELETE FROM tabla_posiciones');
    await client.query('DELETE FROM partidos_grupos');
    await client.query('DELETE FROM equipos');
    console.log('✓ Datos anteriores eliminados');

    // Cargar equipos
    console.log('\n⚽ Cargando equipos...');
    for (const [grupo, listaEquipos] of Object.entries(equipos)) {
      for (const equipo of listaEquipos) {
        await client.query(
          'INSERT INTO equipos (nombre, grupo, pais_codigo) VALUES ($1, $2, $3)',
          [equipo.nombre, grupo, equipo.codigo]
        );
      }
    }
    console.log('✓ 32 equipos cargados');

    // Cargar partidos de grupos
    console.log('\n🏟️ Cargando partidos de grupos...');
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
            `INSERT INTO partidos_grupos 
             (equipo_1_id, equipo_2_id, grupo, jornada) 
             VALUES ($1, $2, $3, $4)`,
            [eq1.rows[0].id, eq2.rows[0].id, grupo, partido.jornada]
          );
        }
      }
    }
    console.log('✓ 48 partidos de grupos cargados');

    // Cargar cuadro eliminatorio
    console.log('\n🏆 Cargando cuadro eliminatorio...');
    
    // Round of 16 (8 partidos)
    for (let i = 1; i <= 8; i++) {
      await client.query(
        `INSERT INTO cuadro_eliminatorio 
         (fase, partido_numero) 
         VALUES ($1, $2)`,
        ['Round of 16', i]
      );
    }

    // Quarterfinals (4 partidos)
    for (let i = 1; i <= 4; i++) {
      await client.query(
        `INSERT INTO cuadro_eliminatorio 
         (fase, partido_numero) 
         VALUES ($1, $2)`,
        ['Quarterfinals', i]
      );
    }

    // Semifinals (2 partidos)
    for (let i = 1; i <= 2; i++) {
      await client.query(
        `INSERT INTO cuadro_eliminatorio 
         (fase, partido_numero) 
         VALUES ($1, $2)`,
        ['Semifinals', i]
      );
    }

    // Final
    await client.query(
      `INSERT INTO cuadro_eliminatorio 
       (fase, partido_numero) 
       VALUES ($1, $2)`,
      ['Final', 1]
    );

    // Tercer puesto
    await client.query(
      `INSERT INTO cuadro_eliminatorio 
       (fase, partido_numero) 
       VALUES ($1, $2)`,
      ['Third Place', 1]
    );

    console.log('✓ 16 partidos del cuadro cargados');

    console.log('\n✅ Datos iniciales cargados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log('   - 32 equipos (8 grupos de 4)');
    console.log('   - 48 partidos de grupos');
    console.log('   - 16 partidos del cuadro eliminatorio');
    console.log('   - 1 partido de tercer puesto\n');

  } catch (error) {
    console.error('\n❌ Error cargando datos:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  cargarDatos();
}

module.exports = cargarDatos;
