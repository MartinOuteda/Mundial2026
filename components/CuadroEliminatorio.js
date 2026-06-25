import { useState, useEffect } from 'react';
import styles from '@/styles/CuadroEliminatorio.module.css';

export default function CuadroEliminatorio() {
  const [cuadro, setCuadro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editandoFecha, setEditandoFecha] = useState(null);
  const [fechaTemp, setFechaTemp] = useState('');

  useEffect(() => {
    cargarCuadro();
  }, []);

  const cargarCuadro = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-cuadro');
      const data = await res.json();
      setCuadro(data);
    } catch (error) {
      console.error('Error cargando cuadro:', error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicionFecha = (matchId, fechaActual) => {
    setEditandoFecha(matchId);
    setFechaTemp(fechaActual || '');
  };

  const guardarFecha = async (matchId) => {
    try {
      const res = await fetch('/.netlify/functions/guardar-fecha-hora', {
        method: 'POST',
        body: JSON.stringify({
          matchId,
          fechaHora: fechaTemp
        })
      });

      if (res.ok) {
        setEditandoFecha(null);
        cargarCuadro();
      }
    } catch (error) {
      console.error('Error guardando fecha:', error);
    }
  };

  const renderPhase = (fase, matches) => {
    return (
      <div key={fase} className={styles.fase}>
        <h3 className={styles.faseTitle}>{fase}</h3>
        <div className={styles.matchesList}>
          {matches.map(match => (
            <div key={match.id} className={styles.matchCard}>
              {/* FECHA/HORA */}
              <div className={styles.fechaSection}>
                {editandoFecha === match.id ? (
                  <div className={styles.fechaEdit}>
                    <input
                      type="text"
                      placeholder="Ej: Dom, 28/4, 4:00 p.m."
                      value={fechaTemp}
                      onChange={(e) => setFechaTemp(e.target.value)}
                      className={styles.fechaInput}
                    />
                    <button
                      className={styles.btnSaveFecha}
                      onClick={() => guardarFecha(match.id)}
                    >
                      ✓
                    </button>
                    <button
                      className={styles.btnCancelFecha}
                      onClick={() => setEditandoFecha(null)}
                    >
                      ✗
                    </button>
                  </div>
                ) : (
                  <div
                    className={styles.fechaDisplay}
                    onClick={() => iniciarEdicionFecha(match.id, match.fecha_hora)}
                  >
                    <span className={styles.fechaText}>
                      {match.fecha_hora || '⏰ Agregar fecha'}
                    </span>
                  </div>
                )}
              </div>

              {/* EQUIPO 1 */}
              <div className={styles.equipoRow}>
                {match.equipo_1_id ? (
                  <>
                    <img
                      src={match.bandera_1}
                      alt={match.equipo_1}
                      className={styles.flagSmall}
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                    <span className={styles.nombreEquipo}>{match.equipo_1}</span>
                  </>
                ) : (
                  <span className={styles.tbd}>A definir</span>
                )}
                <span className={styles.goles}>{match.goles_1 ?? '-'}</span>
              </div>

              {/* EQUIPO 2 */}
              <div className={styles.equipoRow}>
                {match.equipo_2_id ? (
                  <>
                    <img
                      src={match.bandera_2}
                      alt={match.equipo_2}
                      className={styles.flagSmall}
                      onError={(e) => {e.target.style.display = 'none'}}
                    />
                    <span className={styles.nombreEquipo}>{match.equipo_2}</span>
                  </>
                ) : (
                  <span className={styles.tbd}>A definir</span>
                )}
                <span className={styles.goles}>{match.goles_2 ?? '-'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando cuadro eliminatorio...</div>;
  }

  const ro32 = cuadro?.ro32 || [];
  const ro16 = cuadro?.ro16 || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CUADRO ELIMINATORIO</h1>
      
      {renderPhase('Eliminatoria de 32', ro32)}
      {renderPhase('Octavos de final', ro16)}
    </div>
  );
}
