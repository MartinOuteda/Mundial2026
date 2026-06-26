import { useState, useEffect } from 'react';
import styles from '@/styles/CuadroEliminatorio.module.css';

export default function CuadroEliminatorio() {
  const [cuadro, setCuadro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [golesEditando, setGolesEditando] = useState({ g1: '', g2: '' });
  const [editandoFechaId, setEditandoFechaId] = useState(null);
  const [fechaEditando, setFechaEditando] = useState('');
  const [terceros, setTerceros] = useState([]);
  const [seleccionandoTerceroId, setSeleccionandoTerceroId] = useState(null);

  useEffect(() => {
    cargarCuadro();
    cargarTerceros();
  }, []);

  const cargarTerceros = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-terceros');
      const response = await res.json();
      let data = response.body ? JSON.parse(response.body) : response;
      setTerceros(data);
    } catch (error) {
      console.error('Error cargando terceros:', error);
    }
  };

  const cargarCuadro = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-cuadro');
      const response = await res.json();
      let data = response.body ? JSON.parse(response.body) : response;
      setCuadro(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const guardar = async (matchId) => {
    const g1 = String(golesEditando.g1 || '').trim();
    const g2 = String(golesEditando.g2 || '').trim();

    if (!g1 || !g2) {
      alert('Completa ambos campos');
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/guardar-ganador', {
        method: 'POST',
        body: JSON.stringify({
          matchId: parseInt(matchId),
          goles1: parseInt(g1),
          goles2: parseInt(g2)
        })
      });

      if (res.ok) {
        setEditandoId(null);
        setGolesEditando({ g1: '', g2: '' });
        setTimeout(() => cargarCuadro(), 500);
      } else {
        const err = await res.json();
        alert('Error: ' + (err.error || 'No se pudo guardar'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const guardarFecha = async (matchId) => {
    if (!fechaEditando.trim()) {
      alert('Ingresa una fecha');
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/guardar-fecha-hora', {
        method: 'POST',
        body: JSON.stringify({
          matchId: parseInt(matchId),
          fechaHora: fechaEditando
        })
      });

      if (res.ok) {
        setEditandoFechaId(null);
        setFechaEditando('');
        cargarCuadro();
      } else {
        alert('Error guardando fecha');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const guardarTercero = async (matchId, equipoId) => {
    try {
      const res = await fetch('/.netlify/functions/guardar-tercero', {
        method: 'POST',
        body: JSON.stringify({
          matchId: parseInt(matchId),
          equipoId: parseInt(equipoId)
        })
      });

      if (res.ok) {
        setSeleccionandoTerceroId(null);
        cargarCuadro();
      } else {
        alert('Error guardando tercero');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const tieneTecer = (matchId) => {
    // IDs de los 8 partidos que incluyen terceros: 17, 18, 23, 24, 29, 30, 31, 32
    return [17, 18, 23, 24, 29, 30, 31, 32].includes(matchId);
  };

  const renderMatch = (match, isRO16 = false, idx = 0) => {
    const isEditing = editandoId === match.id;
    const isEditingFecha = editandoFechaId === match.id;
    const seleccionandoTercero = seleccionandoTerceroId === match.id;
    const conTercero = !isRO16 && tieneTecer(match.id);

    return (
      <div key={match.id} className={`${styles.matchCard} ${isRO16 ? styles[`color_${['azul', 'amarillo', 'naranja', 'amarillo', 'rojo', 'gris', 'rosa', 'verde'][idx]}`] : ''}`}>
        
        {/* FECHA */}
        <div className={styles.fechaDisplay}>
          {isEditingFecha ? (
            <div className={styles.fechaEdit}>
              <input
                type="text"
                value={fechaEditando}
                onChange={(e) => setFechaEditando(e.target.value)}
                placeholder="Ej: Dom, 28/4, 4:00 p.m."
                className={styles.fechaInput}
              />
              <button className={styles.btnSave} onClick={() => guardarFecha(match.id)}>✓</button>
              <button className={styles.btnCancel} onClick={() => setEditandoFechaId(null)}>✗</button>
            </div>
          ) : (
            <span 
              className={styles.fechaText}
              onClick={() => {
                setEditandoFechaId(match.id);
                setFechaEditando(match.fecha_hora || '');
              }}
            >
              {match.fecha_hora || '⏰ Agregar fecha'}
            </span>
          )}
        </div>

        {/* EQUIPOS */}
        {isEditing ? (
          <div className={styles.golesEdit}>
            <div className={styles.equipoEdit}>
              <span>{match.equipo_1 || 'A definir'}</span>
              <input
                type="number"
                value={golesEditando.g1}
                onChange={(e) => setGolesEditando({ ...golesEditando, g1: e.target.value })}
                className={styles.golesInputEdit}
                placeholder="0"
              />
            </div>
            <div className={styles.equipoEdit}>
              <span>{match.equipo_2 || 'A definir'}</span>
              <input
                type="number"
                value={golesEditando.g2}
                onChange={(e) => setGolesEditando({ ...golesEditando, g2: e.target.value })}
                className={styles.golesInputEdit}
                placeholder="0"
              />
            </div>
            <div className={styles.acciones}>
              <button className={styles.btnSave} onClick={() => guardar(match.id)}>✓</button>
              <button className={styles.btnCancel} onClick={() => setEditandoId(null)}>✗</button>
            </div>
          </div>
        ) : conTercero && seleccionandoTercero ? (
          <div className={styles.terceroDropdown}>
            <div className={styles.equipoRow}>
              {match.bandera_1 && <img src={match.bandera_1} alt="" className={styles.flag} />}
              <span className={styles.nombreEquipo}>{match.equipo_1 || 'A definir'}</span>
              <span className={styles.goles}>-</span>
            </div>
            <select 
              className={styles.selectTercero}
              onChange={(e) => guardarTercero(match.id, e.target.value)}
            >
              <option value="">Seleccionar tercero...</option>
              {terceros.map(t => (
                <option key={t.id} value={t.id}>
                  {t.equipo}
                </option>
              ))}
            </select>
            <button className={styles.btnCancel} onClick={() => setSeleccionandoTerceroId(null)}>✗</button>
          </div>
        ) : (
          <div className={styles.equiposSection} onClick={() => {
            if (conTercero) {
              setSeleccionandoTerceroId(match.id);
            } else {
              setEditandoId(match.id);
              setGolesEditando({ g1: match.goles_1 || '', g2: match.goles_2 || '' });
            }
          }}>
            <div className={styles.equipoRow}>
              {match.bandera_1 && <img src={match.bandera_1} alt="" className={styles.flag} />}
              <span className={styles.nombreEquipo}>{match.equipo_1 || 'A definir'}</span>
              <span className={styles.goles}>{match.goles_1 === 0 ? '0' : (match.goles_1 || '-')}</span>
            </div>
            <div className={styles.equipoRow}>
              {match.bandera_2 && <img src={match.bandera_2} alt="" className={styles.flag} />}
              <span className={styles.nombreEquipo}>{match.equipo_2 || 'A definir'}</span>
              <span className={styles.goles}>{match.goles_2 === 0 ? '0' : (match.goles_2 || '-')}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (cargando) return <div className={styles.cargando}>Cargando...</div>;

  const ro32 = cuadro?.roundOf32 || [];
  const ro16 = cuadro?.roundOf16 || [];

  return (
    <div className={styles.containerFull}>
      <h1 className={styles.title}>CUADRO ELIMINATORIO</h1>
      <div className={styles.bracket}>
        <div className={styles.column}>
          <h2 className={styles.columnTitle}>Eliminatoria de 32</h2>
          <div className={styles.matchesList}>
            {ro32.map(m => renderMatch(m))}
          </div>
        </div>
        <div className={styles.columnRO16}>
          <h2 className={styles.columnTitle}>Eliminatoria de 16</h2>
          <div className={styles.matchesListRO16}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div 
                key={i} 
                className={i % 2 === 0 ? styles.matchWrapper : styles.matchWrapperEmpty}
                style={i % 2 === 0 ? { marginTop: '65px' } : {}}
              >
                {i % 2 === 0 && renderMatch(ro16[Math.floor(i / 2)], true, Math.floor(i / 2))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
