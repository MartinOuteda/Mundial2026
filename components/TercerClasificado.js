import { useState, useEffect } from 'react';
import styles from '@/styles/TercerClasificado.module.css';

export default function TercerClasificado() {
  const [terceros, setTerceros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTerceros();
  }, []);

  const cargarTerceros = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-terceros');
      if (res.ok) {
        const data = await res.json();
        setTerceros(data);
      }
    } catch (error) {
      console.error('Error cargando terceros:', error);
    }
    setCargando(false);
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando terceros clasificados...</div>;
  }

  return (
    <div className={styles.terceros}>
      <h1>📊 Terceros Clasificados</h1>
      
      <div className={styles.info}>
        <p>De los 12 terceros lugares (uno por grupo), clasifican los <strong>8 con más puntos</strong>.</p>
        <p>En caso de empate en puntos se desempata por diferencia de goles, goles a favor y resultado entre sí.</p>
      </div>

      {terceros.length > 0 ? (
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Equipo</th>
              <th>Grupo</th>
              <th>PTS</th>
              <th>DG</th>
              <th>GF</th>
              <th>Clasificado</th>
            </tr>
          </thead>
          <tbody>
            {terceros.map((equipo, idx) => (
              <tr key={idx} className={equipo.clasificado ? styles.clasificado : ''}>
                <td className={styles.ranking}>
                  {idx + 1}
                  {idx < 8 && <span className={styles.check}>✓</span>}
                </td>
                <td className={styles.equipo}>{equipo.nombre}</td>
                <td>{equipo.grupo}</td>
                <td className={styles.puntos}>{equipo.puntos}</td>
                <td>{equipo.diferencia_goles > 0 ? '+' : ''}{equipo.diferencia_goles}</td>
                <td>{equipo.goles_a_favor}</td>
                <td>
                  {idx < 8 ? (
                    <span className={styles.si}>SÍ</span>
                  ) : (
                    <span className={styles.no}>NO</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.sinDatos}>Complete la fase de grupos para ver los terceros clasificados.</p>
      )}

      <button onClick={cargarTerceros} className={styles.btnActualizar}>
        🔄 Actualizar datos
      </button>
    </div>
  );
}
