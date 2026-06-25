import { useState, useEffect } from 'react';
import styles from '@/styles/CuadroEliminatorio.module.css';

export default function CuadroEliminatorio() {
  const [cuadro, setCuadro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null); // {roundId, matchId}
  const [golesTemp, setGolesTemp] = useState({ goles1: 0, goles2: 0 });

  useEffect(() => {
    cargarCuadro();
  }, []);

  const cargarCuadro = async () => {
    setCargando(true);
    try {
      const res = await fetch('/.netlify/functions/obtener-cuadro');
      if (res.ok) {
        const data = await res.json();
        setCuadro(data);
      }
    } catch (error) {
      console.error('Error cargando cuadro:', error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (roundId, matchId, match) => {
    setEditando({ roundId, matchId });
    setGolesTemp({
      goles1: match.goles_1 ?? 0,
      goles2: match.goles_2 ?? 0
    });
  };

  const guardarResultado = async (roundId, matchId) => {
    try {
      const res = await fetch('/.netlify/functions/guardar-ganador', {
        method: 'POST',
        body: JSON.stringify({
          matchId,
          goles1: parseInt(golesTemp.goles1),
          goles2: parseInt(golesTemp.goles2)
        })
      });
      if (res.ok) {
        setEditando(null);
        cargarCuadro();
      }
    } catch (error) {
      console.error('Error guardando resultado:', error);
    }
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando cuadro eliminatorio...</div>;
  }

  if (!cuadro) {
    return <div className={styles.error}>Error cargando cuadro eliminatorio</div>;
  }

  const renderMatch = (match, roundId, matchId) => {
    const isEditing = editando?.matchId === matchId && editando?.roundId === roundId;
    const hasGanador = match.ganador_id !== null;

    return (
      <div key={matchId} className={`${styles.match} ${hasGanador ? styles.matchCompleted : ''}`}>
        {/* Equipo 1 */}
        <div className={styles.equipo}>
          {match.equipo_1_id ? (
            <>
              <img 
                src={match.bandera_1} 
                alt={match.equipo_1}
                className={styles.bandera}
                onError={(e) => {e.target.style.display = 'none'}}
              />
              <div className={styles.equipoInfo}>
                <span className={styles.codigo}>{match.codigo_1}</span>
                <span className={styles.nombre}>{match.equipo_1}</span>
              </div>
            </>
          ) : (
            <span className={styles.vacio}>TBD</span>
          )}
        </div>

        {/* Goles */}
        <div className={styles.goles}>
          {isEditing ? (
            <>
              <input 
                type="number" 
                min="0" 
                max="10"
                value={golesTemp.goles1}
                onChange={(e) => setGolesTemp({...golesTemp, goles1: e.target.value})}
                className={styles.inputGol}
              />
              <span className={styles.separador}>-</span>
              <input 
                type="number" 
                min="0" 
                max="10"
                value={golesTemp.goles2}
                onChange={(e) => setGolesTemp({...golesTemp, goles2: e.target.value})}
                className={styles.inputGol}
              />
            </>
          ) : (
            <>
              <span className={styles.gol}>{match.goles_1 ?? '-'}</span>
              <span className={styles.separador}>-</span>
              <span className={styles.gol}>{match.goles_2 ?? '-'}</span>
            </>
          )}
        </div>

        {/* Equipo 2 */}
        <div className={styles.equipo}>
          {match.equipo_2_id ? (
            <>
              <img 
                src={match.bandera_2} 
                alt={match.equipo_2}
                className={styles.bandera}
                onError={(e) => {e.target.style.display = 'none'}}
              />
              <div className={styles.equipoInfo}>
                <span className={styles.codigo}>{match.codigo_2}</span>
                <span className={styles.nombre}>{match.equipo_2}</span>
              </div>
            </>
          ) : (
            <span className={styles.vacio}>TBD</span>
          )}
        </div>

        {/* Botones */}
        <div className={styles.acciones}>
          {isEditing ? (
            <>
              <button 
                className={styles.btnGuardar}
                onClick={() => guardarResultado(roundId, matchId)}
              >
                ✓
              </button>
              <button 
                className={styles.btnCancelar}
                onClick={() => setEditando(null)}
              >
                ✗
              </button>
            </>
          ) : (
            <button 
              className={styles.btnEditar}
              onClick={() => iniciarEdicion(roundId, matchId, match)}
              disabled={!match.equipo_1_id || !match.equipo_2_id}
            >
              {match.goles_1 !== null ? '✎' : '+'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>CUADRO <span className={styles.highlight}>ELIMINATORIO</span></h1>
        <p>Haz clic en un partido para ingresar el resultado.</p>
      </div>

      <div className={styles.bracketsContainer}>
        
        {/* ROUND OF 32 */}
        <div className={styles.round}>
          <h2 className={styles.roundTitle}>Round of 32</h2>
          <div className={styles.matches}>
            {cuadro.roundOf32?.map((match, idx) => 
              renderMatch(match, 'ro32', match.id)
            )}
          </div>
        </div>

        {/* ROUND OF 16 */}
        <div className={styles.round}>
          <h2 className={styles.roundTitle}>Round of 16</h2>
          <div className={styles.matches}>
            {cuadro.roundOf16?.map((match, idx) => 
              renderMatch(match, 'ro16', match.id)
            )}
          </div>
        </div>

        {/* QUARTER FINALS */}
        <div className={styles.round}>
          <h2 className={styles.roundTitle}>Cuartos de Final</h2>
          <div className={styles.matches}>
            {cuadro.quarterfinals?.map((match, idx) => 
              renderMatch(match, 'qf', match.id)
            )}
          </div>
        </div>

        {/* SEMI FINALS */}
        <div className={styles.round}>
          <h2 className={styles.roundTitle}>Semifinales</h2>
          <div className={styles.matches}>
            {cuadro.semifinals?.map((match, idx) => 
              renderMatch(match, 'sf', match.id)
            )}
          </div>
        </div>

        {/* FINAL */}
        <div className={styles.round}>
          <h2 className={styles.roundTitle}>FINAL</h2>
          <div className={styles.finalMatch}>
            {cuadro.final && renderMatch(cuadro.final, 'final', cuadro.final.id)}
          </div>
        </div>

      </div>

      {/* THIRD PLACE */}
      <div className={styles.thirdPlaceSection}>
        <h2>🥉 Tercer Lugar</h2>
        {cuadro.thirdPlace && (
          <div className={styles.thirdPlaceMatch}>
            {renderMatch(cuadro.thirdPlace, 'third', cuadro.thirdPlace.id)}
          </div>
        )}
      </div>
    </div>
  );
}
