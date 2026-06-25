import { useState, useEffect } from 'react';
import styles from '@/styles/CuadroEliminatorio.module.css';

export default function CuadroEliminatorio() {
  const [cuadro, setCuadro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);
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

  const renderTeam = (team, isEditing, gol, onChange) => (
    <div className={styles.team}>
      {team?.id ? (
        <>
          <img 
            src={team.bandera} 
            alt={team.nombre}
            className={styles.flag}
            onError={(e) => {e.target.style.display = 'none'}}
          />
          <span className={styles.teamCode}>{team.codigo}</span>
        </>
      ) : (
        <span className={styles.tbd}>TBD</span>
      )}
      <div className={styles.golInput}>
        {isEditing ? (
          <input 
            type="number" 
            min="0" 
            max="10"
            value={gol}
            onChange={onChange}
            className={styles.inputGol}
          />
        ) : (
          <span className={styles.golDisplay}>{gol ?? '-'}</span>
        )}
      </div>
    </div>
  );

  const renderMatch = (match, roundId, matchId) => {
    const isEditing = editando?.matchId === matchId && editando?.roundId === roundId;
    const hasGanador = match.ganador_id !== null;

    return (
      <div key={matchId} className={`${styles.match} ${hasGanador ? styles.completed : ''}`}>
        {renderTeam(
          { id: match.equipo_1_id, nombre: match.equipo_1, codigo: match.codigo_1, bandera: match.bandera_1 },
          isEditing,
          golesTemp.goles1,
          (e) => setGolesTemp({...golesTemp, goles1: e.target.value})
        )}
        
        {isEditing ? (
          <div className={styles.actions}>
            <button className={styles.btnSave} onClick={() => guardarResultado(roundId, matchId)}>✓</button>
            <button className={styles.btnCancel} onClick={() => setEditando(null)}>✗</button>
          </div>
        ) : (
          <button 
            className={styles.btnEdit}
            onClick={() => iniciarEdicion(roundId, matchId, match)}
            disabled={!match.equipo_1_id || !match.equipo_2_id}
          >
            {match.goles_1 !== null ? '✎' : '+'}
          </button>
        )}

        {renderTeam(
          { id: match.equipo_2_id, nombre: match.equipo_2, codigo: match.codigo_2, bandera: match.bandera_2 },
          isEditing,
          golesTemp.goles2,
          (e) => setGolesTemp({...golesTemp, goles2: e.target.value})
        )}
      </div>
    );
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando cuadro eliminatorio...</div>;
  }

  if (!cuadro) {
    return <div className={styles.error}>Error cargando datos</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>CUADRO <span className={styles.highlight}>ELIMINATORIO</span></h1>
      </div>

      <div className={styles.bracketsVertical}>
        
        {/* ROUND OF 32 */}
        <div className={styles.roundSection}>
          <h2 className={styles.roundTitle}>ROUND OF 32</h2>
          <div className={styles.roundGrid}>
            {cuadro.roundOf32?.map((match) => renderMatch(match, 'ro32', match.id))}
          </div>
        </div>

        {/* ROUND OF 16 */}
        <div className={styles.roundSection}>
          <h2 className={styles.roundTitle}>ROUND OF 16</h2>
          <div className={styles.roundGrid}>
            {cuadro.roundOf16?.map((match) => renderMatch(match, 'ro16', match.id))}
          </div>
        </div>

        {/* QUARTER FINALS */}
        <div className={styles.roundSection}>
          <h2 className={styles.roundTitle}>CUARTOS</h2>
          <div className={styles.roundGrid}>
            {cuadro.quarterfinals?.map((match) => renderMatch(match, 'qf', match.id))}
          </div>
        </div>

        {/* SEMIFINALS */}
        <div className={styles.roundSection}>
          <h2 className={styles.roundTitle}>SEMIFINALES</h2>
          <div className={styles.roundGrid}>
            {cuadro.semifinals?.map((match) => renderMatch(match, 'sf', match.id))}
          </div>
        </div>

        {/* FINAL */}
        <div className={styles.roundSection}>
          <h2 className={styles.roundTitle}>🏆 FINAL</h2>
          <div className={styles.roundGrid}>
            {cuadro.final && renderMatch(cuadro.final, 'final', cuadro.final.id)}
          </div>
        </div>

      </div>

      {/* TERCER LUGAR */}
      <div className={styles.thirdPlace}>
        <h2>🥉 TERCER LUGAR</h2>
        {cuadro.thirdPlace && renderMatch(cuadro.thirdPlace, 'third', cuadro.thirdPlace.id)}
      </div>
    </div>
  );
}
