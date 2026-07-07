import { useState, useEffect } from 'react';
import styles from '@/styles/Semifinales.module.css';

// Trofeo estilizado (SVG propio, dorado y con brillo).
function Trofeo() {
  return (
    <svg viewBox="0 0 140 190" xmlns="http://www.w3.org/2000/svg" className={styles.trofeoSvg} aria-hidden="true">
      <defs>
        <linearGradient id="oroCopa" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff6cf" />
          <stop offset="45%" stopColor="#e9c65a" />
          <stop offset="100%" stopColor="#9b7620" />
        </linearGradient>
        <linearGradient id="oroBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9c65a" />
          <stop offset="100%" stopColor="#7c5c16" />
        </linearGradient>
      </defs>
      {/* asas */}
      <path d="M40 28 C16 32, 16 64, 44 66" fill="none" stroke="url(#oroCopa)" strokeWidth="6" strokeLinecap="round" />
      <path d="M100 28 C124 32, 124 64, 96 66" fill="none" stroke="url(#oroCopa)" strokeWidth="6" strokeLinecap="round" />
      {/* copa */}
      <path d="M38 22 L102 22 C100 60, 80 84, 70 94 C60 84, 40 60, 38 22 Z" fill="url(#oroCopa)" />
      {/* tallo */}
      <path d="M63 94 L77 94 L74 122 L66 122 Z" fill="url(#oroCopa)" />
      {/* base */}
      <rect x="49" y="122" width="42" height="11" rx="3" fill="url(#oroBase)" />
      <rect x="40" y="133" width="60" height="15" rx="4" fill="url(#oroBase)" />
      {/* brillo */}
      <path d="M52 28 C54 54, 62 72, 68 80" fill="none" stroke="#fff8dd" strokeWidth="3" opacity="0.55" strokeLinecap="round" />
    </svg>
  );
}

export default function Semifinales() {
  const [cuadro, setCuadro] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [golesEditando, setGolesEditando] = useState({ g1: '', g2: '' });
  const [editandoFechaId, setEditandoFechaId] = useState(null);
  const [fechaEditando, setFechaEditando] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-cuadro');
      const response = await res.json();
      const data = response.body ? JSON.parse(response.body) : response;
      setCuadro(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const guardar = async (matchId) => {
    const g1 = String(golesEditando.g1 ?? '').trim();
    const g2 = String(golesEditando.g2 ?? '').trim();
    if (g1 === '' || g2 === '') {
      alert('Completá ambos resultados');
      return;
    }
    try {
      const res = await fetch('/.netlify/functions/guardar-ganador', {
        method: 'POST',
        body: JSON.stringify({ matchId: parseInt(matchId), goles1: parseInt(g1), goles2: parseInt(g2) })
      });
      if (res.ok) {
        setEditandoId(null);
        setGolesEditando({ g1: '', g2: '' });
        setTimeout(() => cargar(), 400);
      } else {
        alert('No se pudo guardar');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const guardarFecha = async (matchId) => {
    if (!fechaEditando.trim()) {
      alert('Ingresá una fecha');
      return;
    }
    try {
      const res = await fetch('/.netlify/functions/guardar-fecha-hora', {
        method: 'POST',
        body: JSON.stringify({ matchId: parseInt(matchId), fechaHora: fechaEditando })
      });
      if (res.ok) {
        setEditandoFechaId(null);
        setFechaEditando('');
        cargar();
      } else {
        alert('Error guardando fecha');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const ganadorDe = (m) => {
    if (!m || m.goles_1 == null || m.goles_2 == null || m.goles_1 === m.goles_2) return null;
    return m.goles_1 > m.goles_2
      ? { nombre: m.equipo_1, bandera: m.bandera_1 }
      : { nombre: m.equipo_2, bandera: m.bandera_2 };
  };

  const gol = (v) => (v === 0 ? '0' : (v ?? '-'));

  const renderCard = (match, variante, label) => {
    if (!match) return null;
    const editando = editandoId === match.id;
    const editandoFecha = editandoFechaId === match.id;
    const decidido = match.goles_1 != null && match.goles_2 != null && match.goles_1 !== match.goles_2;
    const gana1 = decidido && match.goles_1 > match.goles_2;
    const gana2 = decidido && match.goles_2 > match.goles_1;

    return (
      <div className={`${styles.card} ${styles[variante] || ''}`}>
        <div className={styles.faseLabel}>{label}</div>

        <div className={styles.fechaDisplay}>
          {editandoFecha ? (
            <div className={styles.fechaEdit}>
              <input
                type="text"
                value={fechaEditando}
                onChange={(e) => setFechaEditando(e.target.value)}
                placeholder="Ej: Dom, 19/7, 4:00 p.m."
                className={styles.fechaInput}
              />
              <button className={styles.btnSave} onClick={() => guardarFecha(match.id)}>✓</button>
              <button className={styles.btnCancel} onClick={() => setEditandoFechaId(null)}>✗</button>
            </div>
          ) : (
            <span
              className={styles.fechaText}
              onClick={() => { setEditandoFechaId(match.id); setFechaEditando(match.fecha_hora || ''); }}
            >
              {match.fecha_hora || '⏰ Agregar fecha'}
            </span>
          )}
        </div>

        {editando ? (
          <div className={styles.editBox}>
            <div className={styles.editRow}>
              <span className={styles.nombre}>{match.equipo_1 || 'A definir'}</span>
              <input
                type="number" min="0"
                value={golesEditando.g1}
                onChange={(e) => setGolesEditando({ ...golesEditando, g1: e.target.value })}
                className={styles.golInput}
                autoFocus
              />
            </div>
            <div className={styles.editRow}>
              <span className={styles.nombre}>{match.equipo_2 || 'A definir'}</span>
              <input
                type="number" min="0"
                value={golesEditando.g2}
                onChange={(e) => setGolesEditando({ ...golesEditando, g2: e.target.value })}
                className={styles.golInput}
              />
            </div>
            <div className={styles.editAcc}>
              <button className={styles.btnSave} onClick={() => guardar(match.id)}>✓</button>
              <button className={styles.btnCancel} onClick={() => setEditandoId(null)}>✗</button>
            </div>
          </div>
        ) : (
          <div
            className={styles.teams}
            onClick={() => {
              setEditandoId(match.id);
              setGolesEditando({ g1: match.goles_1 ?? '', g2: match.goles_2 ?? '' });
            }}
          >
            <div className={`${styles.equipo} ${gana1 ? styles.win : ''}`}>
              {match.bandera_1 && <img src={match.bandera_1} alt="" className={styles.flag} />}
              <span className={styles.nombre}>{match.equipo_1 || 'A definir'}</span>
              <span className={styles.gol}>{gol(match.goles_1)}</span>
            </div>
            <div className={`${styles.equipo} ${gana2 ? styles.win : ''}`}>
              {match.bandera_2 && <img src={match.bandera_2} alt="" className={styles.flag} />}
              <span className={styles.nombre}>{match.equipo_2 || 'A definir'}</span>
              <span className={styles.gol}>{gol(match.goles_2)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (cargando) return <div className={styles.cargando}>Cargando…</div>;

  const sf = cuadro?.semifinals || [];
  const final = cuadro?.final || null;
  const tercero = cuadro?.thirdPlace || null;
  const campeon = ganadorDe(final);

  return (
    <div className={styles.container}>
      <div className={styles.trofeoWrap}>
        <Trofeo />
        <div className={styles.campeonLabel}>CAMPEÓN</div>
        <div className={`${styles.campeonNombre} ${campeon ? styles.campeonActivo : ''}`}>
          {campeon ? campeon.nombre : 'A definir'}
        </div>
      </div>

      <div className={styles.bracket}>
        <div className={styles.lado}>
          {renderCard(sf[0], 'semi', 'Semifinal 1')}
        </div>
        <div className={styles.centro}>
          {renderCard(final, 'final', '🏆 Final')}
        </div>
        <div className={styles.lado}>
          {renderCard(sf[1], 'semi', 'Semifinal 2')}
        </div>
      </div>

      <div className={styles.terceroWrap}>
        {renderCard(tercero, 'tercero', '🥉 Tercer Puesto')}
      </div>
    </div>
  );
}
