import { useState, useEffect } from 'react';
import styles from '@/styles/CuadroEliminatorio.module.css';

export default function CuadroEliminatorio() {
  const [cuadro, setCuadro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState('ro32');
  const [editando, setEditando] = useState(null); // { matchId, tipo: 'fecha' | 'goles' }
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    cargarCuadro();
  }, []);

  const cargarCuadro = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-cuadro');
      const response = await res.json();
      
      let data;
      if (response.body) {
        data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
      } else {
        data = response;
      }
      
      setCuadro(data);
    } catch (error) {
      console.error('Error cargando cuadro:', error);
    } finally {
      setCargando(false);
    }
  };

  const iniciarEdicion = (matchId, tipo, valor) => {
    setEditando({ matchId, tipo });
    setEditValues(prev => ({ ...prev, [matchId]: valor }));
  };

  const guardarFecha = async (matchId) => {
    try {
      await fetch('/.netlify/functions/guardar-fecha-hora', {
        method: 'POST',
        body: JSON.stringify({
          matchId,
          fechaHora: editValues[matchId]
        })
      });
      setEditando(null);
      cargarCuadro();
    } catch (error) {
      console.error('Error guardando fecha:', error);
    }
  };

  const guardarGoles = async (matchId) => {
    try {
      await fetch('/.netlify/functions/guardar-ganador', {
        method: 'POST',
        body: JSON.stringify({
          matchId,
          goles1: parseInt(editValues[`${matchId}_goles1`]),
          goles2: parseInt(editValues[`${matchId}_goles2`])
        })
      });
      setEditando(null);
      cargarCuadro();
    } catch (error) {
      console.error('Error guardando goles:', error);
    }
  };

  const renderMatch = (match) => {
    const isEditingFecha = editando?.matchId === match.id && editando?.tipo === 'fecha';
    const isEditingGoles = editando?.matchId === match.id && editando?.tipo === 'goles';
    const hasWinner = match.ganador_id !== null;

    return (
      <div key={match.id} className={styles.matchCard}>
        {/* FECHA/HORA */}
        <div className={styles.fechaSection}>
          {isEditingFecha ? (
            <div className={styles.fechaEdit}>
              <input
                type="text"
                placeholder="Ej: Dom, 28/4, 4:00 p.m."
                value={editValues[match.id] || ''}
                onChange={(e) => setEditValues(prev => ({ ...prev, [match.id]: e.target.value }))}
                className={styles.fechaInput}
              />
              <button className={styles.btnSave} onClick={() => guardarFecha(match.id)}>✓</button>
              <button className={styles.btnCancel} onClick={() => setEditando(null)}>✗</button>
            </div>
          ) : (
            <div 
              className={styles.fechaDisplay}
              onClick={() => iniciarEdicion(match.id, 'fecha', match.fecha_hora || '')}
            >
              {match.fecha_hora ? (
                <span className={styles.fechaText}>{match.fecha_hora}</span>
              ) : (
                <span className={styles.fechaPlaceholder}>⏰ Agregar fecha</span>
              )}
            </div>
          )}
        </div>

        {/* EQUIPOS Y GOLES */}
        {isEditingGoles ? (
          <div className={styles.golesEdit}>
            <div className={styles.equipoEdit}>
              <span className={styles.nombreEquipo}>{match.equipo_1}</span>
              <input
                type="number"
                min="0"
                max="10"
                value={editValues[`${match.id}_goles1`] || match.goles_1 || 0}
                onChange={(e) => setEditValues(prev => ({ 
                  ...prev, 
                  [`${match.id}_goles1`]: e.target.value 
                }))}
                className={styles.golesInputEdit}
              />
            </div>
            <div className={styles.equipoEdit}>
              <span className={styles.nombreEquipo}>{match.equipo_2}</span>
              <input
                type="number"
                min="0"
                max="10"
                value={editValues[`${match.id}_goles2`] || match.goles_2 || 0}
                onChange={(e) => setEditValues(prev => ({ 
                  ...prev, 
                  [`${match.id}_goles2`]: e.target.value 
                }))}
                className={styles.golesInputEdit}
              />
            </div>
            <div className={styles.acciones}>
              <button className={styles.btnSave} onClick={() => guardarGoles(match.id)}>✓</button>
              <button className={styles.btnCancel} onClick={() => setEditando(null)}>✗</button>
            </div>
          </div>
        ) : (
          <div 
            className={`${styles.equiposSection} ${hasWinner ? styles.completed : ''}`}
            onClick={() => iniciarEdicion(match.id, 'goles', null)}
          >
            <div className={styles.equipoRow}>
              {match.equipo_1_id ? (
                <>
                  <img src={match.bandera_1} alt={match.equipo_1} className={styles.flag} onError={(e) => e.target.style.display = 'none'} />
                  <span className={styles.nombreEquipo}>{match.equipo_1}</span>
                </>
              ) : (
                <span className={styles.tbd}>A definir</span>
              )}
              <span className={styles.goles}>{match.goles_1 ?? '-'}</span>
            </div>
            <div className={styles.equipoRow}>
              {match.equipo_2_id ? (
                <>
                  <img src={match.bandera_2} alt={match.equipo_2} className={styles.flag} onError={(e) => e.target.style.display = 'none'} />
                  <span className={styles.nombreEquipo}>{match.equipo_2}</span>
                </>
              ) : (
                <span className={styles.tbd}>A definir</span>
              )}
              <span className={styles.goles}>{match.goles_2 ?? '-'}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando cuadro eliminatorio...</div>;
  }

  const ro32 = cuadro?.roundOf32 || [];
  const ro16 = cuadro?.roundOf16 || [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CUADRO ELIMINATORIO</h1>
      
      {/* TABS */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${tab === 'ro32' ? styles.active : ''}`}
          onClick={() => setTab('ro32')}
        >
          Eliminatoria de 32
        </button>
        <button 
          className={`${styles.tab} ${tab === 'ro16' ? styles.active : ''}`}
          onClick={() => setTab('ro16')}
        >
          Octavos de final
        </button>
      </div>

      {/* CONTENIDO */}
      <div className={styles.content}>
        {tab === 'ro32' && (
          <div className={styles.matchesList}>
            {ro32.map(match => renderMatch(match))}
          </div>
        )}
        {tab === 'ro16' && (
          <div className={styles.matchesList}>
            {ro16.map(match => renderMatch(match))}
          </div>
        )}
      </div>
    </div>
  );
}
