import { useState, useEffect } from 'react';
import styles from '@/styles/CuadroEliminatorio.module.css';

const fases = ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final', 'Third Place'];

export default function CuadroEliminatorio() {
  const [cuadro, setCuadro] = useState({});
  const [faseActual, setFaseActual] = useState('Round of 16');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarCuadro();
  }, []);

  const cargarCuadro = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-cuadro');
      if (res.ok) {
        const data = await res.json();
        setCuadro(data);
      }
    } catch (error) {
      console.error('Error cargando cuadro:', error);
    }
    setCargando(false);
  };

  const seleccionarGanador = async (partidoId, equipoId) => {
    setGuardando(true);
    try {
      const res = await fetch('/.netlify/functions/guardar-ganador', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partidoId,
          ganadorId: equipoId
        })
      });

      if (res.ok) {
        await cargarCuadro();
      }
    } catch (error) {
      console.error('Error guardando ganador:', error);
    }
    setGuardando(false);
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando cuadro eliminatorio...</div>;
  }

  const partidos = cuadro[faseActual] || [];

  return (
    <div className={styles.cuadro}>
      <h1>🏆 Cuadro Eliminatorio</h1>

      <div className={styles.tabs}>
        {fases.map(fase => (
          <button
            key={fase}
            className={`${styles.tab} ${faseActual === fase ? styles.activo : ''}`}
            onClick={() => setFaseActual(fase)}
          >
            {fase === 'Round of 16' && '16avos'}
            {fase === 'Quarterfinals' && 'Cuartos'}
            {fase === 'Semifinals' && 'Semis'}
            {fase === 'Final' && 'Final'}
            {fase === 'Third Place' && '3er lugar'}
          </button>
        ))}
      </div>

      <div className={styles.partidos}>
        {partidos.length > 0 ? (
          partidos.map((partido, idx) => (
            <div key={idx} className={styles.partido}>
              <div className={styles.titulo}>
                Partido {partido.numero}
              </div>

              <div className={styles.enfrentamiento}>
                <button
                  className={`${styles.equipo} ${
                    partido.ganador_id === partido.equipo1_id ? styles.ganador : ''
                  }`}
                  onClick={() => seleccionarGanador(partido.id, partido.equipo1_id)}
                  disabled={guardando}
                >
                  <span className={styles.nombre}>{partido.equipo1 || 'TBD'}</span>
                  {partido.goles_1 !== null && (
                    <span className={styles.goles}>{partido.goles_1}</span>
                  )}
                </button>

                <div className={styles.vs}>vs</div>

                <button
                  className={`${styles.equipo} ${
                    partido.ganador_id === partido.equipo2_id ? styles.ganador : ''
                  }`}
                  onClick={() => seleccionarGanador(partido.id, partido.equipo2_id)}
                  disabled={guardando}
                >
                  <span className={styles.nombre}>{partido.equipo2 || 'TBD'}</span>
                  {partido.goles_2 !== null && (
                    <span className={styles.goles}>{partido.goles_2}</span>
                  )}
                </button>
              </div>

              {partido.ganador && (
                <div className={styles.ganadorInfo}>
                  ✓ Ganador: <strong>{partido.ganador}</strong>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className={styles.sinDatos}>
            Complete la fase anterior para ver estos partidos.
          </p>
        )}
      </div>

      <button onClick={cargarCuadro} className={styles.btnActualizar}>
        🔄 Actualizar
      </button>

      {faseActual === 'Final' && cuadro.Final?.[0]?.ganador && (
        <div className={styles.campeon}>
          <h2>🏆 CAMPEÓN DEL MUNDO 2026</h2>
          <p className={styles.nombreCampeon}>{cuadro.Final[0].ganador}</p>
        </div>
      )}
    </div>
  );
}
