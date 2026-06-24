import { useState, useEffect } from 'react';
import styles from '@/styles/FaseGrupos.module.css';
import { partidos as fixturePartidos, equipos as fixtureEquipos, grupos } from '@/lib/fixture';

export default function FaseGrupos() {
  const [resultados, setResultados] = useState({});
  const [tablas, setTablas] = useState({});
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState('');

  // Inicializar estado de resultados
  useEffect(() => {
    const init = {};
    grupos.forEach(grupo => {
      init[grupo] = {};
      fixturePartidos[grupo].forEach((partido, idx) => {
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
          // Cargar resultados existentes
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
      for (const grupo of grupos) {
        fixturePartidos[grupo].forEach(async (partido, idx) => {
          const { goles1, goles2 } = resultados[grupo][idx];
          
          await fetch('/.netlify/functions/guardar-resultado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              grupo,
              equipo1: partido.equipo1,
              equipo2: partido.equipo2,
              goles1: goles1 || 0,
              goles2: goles2 || 0
            })
          });
        });
      }
      
      setTimeout(() => {
        setMensajeGuardado('✓ Resultados guardados correctamente');
        cargarTablas();
      }, 1500);
      
      setTimeout(() => setMensajeGuardado(''), 3000);
    } catch (error) {
      console.error('Error guardando:', error);
      setMensajeGuardado('✗ Error al guardar los resultados');
    }
    
    setGuardando(false);
  };

  const contarCompletados = () => {
    let total = 0;
    for (const grupo of grupos) {
      fixturePartidos[grupo].forEach((_, idx) => {
        const { goles1, goles2 } = resultados[grupo]?.[idx] || {};
        if (goles1 !== '' && goles2 !== '') total++;
      });
    }
    return total;
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando...</div>;
  }

  return (
    <div className={styles.faseGrupos}>
      <h1>⚽ Fase de Grupos</h1>
      
      <div className={styles.progreso}>
        <p>Partidos completados: <strong>{contarCompletados()} / {grupos.length * 6}</strong></p>
        <div className={styles.barraProgreso}>
          <div 
            className={styles.relleno}
            style={{ width: `${(contarCompletados() / (grupos.length * 6)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.grupos}>
        {grupos.map(grupo => (
          <div key={grupo} className={styles.grupo}>
            <h2>Grupo {grupo}</h2>
            
            <div className={styles.partidos}>
              {fixturePartidos[grupo].map((partido, idx) => (
                <div key={idx} className={styles.partido}>
                  <div className={styles.equipos}>
                    <span className={styles.equipo1}>{partido.equipo1}</span>
                    <span className={styles.vs}>vs</span>
                    <span className={styles.equipo2}>{partido.equipo2}</span>
                  </div>
                  
                  <div className={styles.goles}>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={resultados[grupo]?.[idx]?.goles1 || ''}
                      onChange={(e) => handleGolesChange(grupo, idx, '1', e.target.value)}
                      placeholder="0"
                      className={styles.inputGoles}
                    />
                    <span className={styles.separador}>-</span>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={resultados[grupo]?.[idx]?.goles2 || ''}
                      onChange={(e) => handleGolesChange(grupo, idx, '2', e.target.value)}
                      placeholder="0"
                      className={styles.inputGoles}
                    />
                  </div>

                  <span className={styles.jornada}>J{partido.jornada}</span>
                </div>
              ))}
            </div>

            {tablas[grupo] && (
              <div className={styles.tabla}>
                <h3>Tabla de posiciones</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Equipo</th>
                      <th>PJ</th>
                      <th>G</th>
                      <th>E</th>
                      <th>P</th>
                      <th>GF</th>
                      <th>GC</th>
                      <th>DG</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tablas[grupo].map((equipo, i) => (
                      <tr key={i} className={i < 2 ? styles.clasificado : ''}>
                        <td className={styles.equipo}>{equipo.nombre}</td>
                        <td>{equipo.partidos_jugados}</td>
                        <td>{equipo.victorias}</td>
                        <td>{equipo.empates}</td>
                        <td>{equipo.derrotas}</td>
                        <td>{equipo.goles_a_favor}</td>
                        <td>{equipo.goles_en_contra}</td>
                        <td>{equipo.diferencia}</td>
                        <td className={styles.puntos}><strong>{equipo.puntos}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.acciones}>
        <button 
          onClick={guardarResultados}
          disabled={guardando}
          className={styles.btnGuardar}
        >
          {guardando ? 'Guardando...' : '💾 Guardar Resultados'}
        </button>
        
        {mensajeGuardado && (
          <div className={styles.mensaje}>{mensajeGuardado}</div>
        )}
      </div>
    </div>
  );
}
