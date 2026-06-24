import { useState, useEffect } from 'react';
import styles from '@/styles/FaseGrupos.module.css';
import { partidos as fixturePartidos, equipos as fixtureEquipos, grupos } from '@/lib/fixture';

export default function FaseGrupos() {
  const [resultados, setResultados] = useState({});
  const [tablas, setTablas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState('');

  useEffect(() => {
    const init = {};
    grupos.forEach(grupo => {
      init[grupo] = {};
      fixturePartidos[grupo].forEach((_, idx) => {
        init[grupo][idx] = { goles1: '', goles2: '' };
      });
    });
    setResultados(init);
    cargarTablas();
  }, []);

  const cargarTablas = async () => {
    setCargando(true);
    try {
      for (const grupo of grupos) {
        const res = await fetch(`/.netlify/functions/obtener-grupo?grupo=${grupo}`);
        if (res.ok) {
          const data = await res.json();
          setTablas(prev => ({
            ...prev,
            [grupo]: data.tabla
          }));
          
          data.partidos.forEach((partido, idx) => {
            if (partido.goles_1 !== null) {
              setResultados(prev => ({
                ...prev,
                [grupo]: {
                  ...prev[grupo],
                  [idx]: { goles1: partido.goles_1, goles2: partido.goles_2 }
                }
              }));
            }
          });
        }
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
    setCargando(false);
  };

  const handleGolesChange = (grupo, idx, tipo, valor) => {
    setResultados(prev => ({
      ...prev,
      [grupo]: {
        ...prev[grupo],
        [idx]: {
          ...prev[grupo][idx],
          [tipo === '1' ? 'goles1' : 'goles2']: valor
        }
      }
    }));
  };

  const guardarResultados = async () => {
    setGuardando(true);
    setMensajeGuardado('Guardando...');
    
    try {
      const promesas = [];
      
      for (const grupo of grupos) {
        for (let idx = 0; idx < fixturePartidos[grupo].length; idx++) {
          const partido = fixturePartidos[grupo][idx];
          const { goles1, goles2 } = resultados[grupo][idx];
          
          if (goles1 !== '' && goles2 !== '') {
            promesas.push(
              fetch('/.netlify/functions/guardar-resultado', {
                method: 'POST',
                body: JSON.stringify({
                  grupo,
                  equipo1: partido.equipo1,
                  equipo2: partido.equipo2,
                  goles1: parseInt(goles1),
                  goles2: parseInt(goles2)
                })
              })
            );
          }
        }
      }

      await Promise.all(promesas);
      setMensajeGuardado('✓ Resultados guardados correctamente');
      await cargarTablas();
      
      setTimeout(() => setMensajeGuardado(''), 3000);
    } catch (error) {
      console.error('Error guardando:', error);
      setMensajeGuardado('✗ Error al guardar los resultados');
    }
    
    setGuardando(false);
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>⚽ FASE DE GRUPOS</h1>
        <p>Predecí los resultados y elige tu campeón</p>
      </div>

      <div className={styles.gruposGrid}>
        {grupos.map(grupo => (
          <div key={grupo} className={styles.grupoCard}>
            <div className={styles.grupoTitle}>
              <h2>GRUPO {grupo}</h2>
              <span className={styles.subtitle}>4 EQUIPOS · 6 PARTIDOS</span>
            </div>

            {/* TABLA DE POSICIONES */}
            <div className={styles.tabla}>
              <div className={styles.tablaHeader}>
                <div className={styles.colEquipo}>EQUIPO</div>
                <div className={styles.colPts}>PTS</div>
                <div className={styles.colPj}>PJ</div>
                <div className={styles.colGf}>GF</div>
                <div className={styles.colGc}>GC</div>
                <div className={styles.colDg}>DG</div>
              </div>
              <div className={styles.tablaBody}>
                {(tablas[grupo] || []).map((equipo, idx) => (
                  <div key={idx} className={styles.tablaRow}>
                    <div className={styles.posicion}>{idx + 1}</div>
                    <div className={styles.equipoCell}>
                      <span className={styles.bandera}>
                        {fixtureEquipos[grupo]?.find(e => e.nombre === equipo.nombre)?.bandera}
                      </span>
                      <span className={styles.nombre}>{equipo.nombre.toUpperCase()}</span>
                    </div>
                    <div className={styles.pts}>{equipo.puntos}</div>
                    <div className={styles.pj}>{equipo.partidos_jugados}</div>
                    <div className={styles.gf}>{equipo.goles_a_favor}</div>
                    <div className={styles.gc}>{equipo.goles_en_contra}</div>
                    <div className={styles.dg}>{equipo.goles_a_favor - equipo.goles_en_contra}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PARTIDOS */}
            <div className={styles.partidos}>
              {fixturePartidos[grupo].map((partido, idx) => {
                const eq1 = fixtureEquipos[grupo].find(e => e.nombre === partido.equipo1);
                const eq2 = fixtureEquipos[grupo].find(e => e.nombre === partido.equipo2);
                const jornada = Math.floor(idx / 2) + 1;
                
                return (
                  <div key={idx} className={styles.partido}>
                    <div className={styles.equipoIzq}>
                      <span className={styles.flagIzq}>{eq1?.bandera}</span>
                      <span className={styles.nombreCorto}>{partido.equipo1.substring(0, 3).toUpperCase()}</span>
                    </div>

                    <div className={styles.goles}>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={resultados[grupo][idx]?.goles1 || ''}
                        onChange={(e) => handleGolesChange(grupo, idx, '1', e.target.value)}
                        className={styles.golesInput}
                      />
                      <span className={styles.vs}>vs</span>
                      <input
                        type="number"
                        min="0"
                        max="99"
                        value={resultados[grupo][idx]?.goles2 || ''}
                        onChange={(e) => handleGolesChange(grupo, idx, '2', e.target.value)}
                        className={styles.golesInput}
                      />
                    </div>

                    <div className={styles.equipoDer}>
                      <span className={styles.nombreCorto}>{partido.equipo2.substring(0, 3).toUpperCase()}</span>
                      <span className={styles.flagDer}>{eq2?.bandera}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button 
          onClick={guardarResultados}
          disabled={guardando}
          className={styles.btnGuardar}
        >
          {guardando ? '⏳ Guardando...' : '💾 GUARDAR RESULTADOS'}
        </button>
        {mensajeGuardado && <p className={styles.mensaje}>{mensajeGuardado}</p>}
      </div>
    </div>
  );
}
