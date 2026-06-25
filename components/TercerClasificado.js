import { useState, useEffect } from 'react';
import styles from '@/styles/TercerClasificado.module.css';

export default function TercerClasificado() {
  const [terceros, setTerceros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTerceros();
  }, []);

  const cargarTerceros = async () => {
    setCargando(true);
    try {
      const res = await fetch('/.netlify/functions/obtener-terceros');
      if (res.ok) {
        const data = await res.json();
        setTerceros(data.terceros);
      }
    } catch (error) {
      console.error('Error cargando terceros:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <div className={styles.cargando}>Cargando terceros clasificados...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>TERCEROS <span className={styles.highlight}>CLASIFICADOS</span></h1>
        <p>Los 8 mejores terceros de los 12 grupos avanzan al cuadro eliminatorio.</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th className={styles.thPos}>#</th>
              <th className={styles.thEquipo}>EQUIPO</th>
              <th className={styles.thGrupo}>GRUPO</th>
              <th className={styles.thNum}>PTS</th>
              <th className={styles.thNum}>PJ</th>
              <th className={styles.thNum}>GF</th>
              <th className={styles.thNum}>GC</th>
              <th className={styles.thNum}>DG</th>
              <th className={styles.thEstado}>ESTADO</th>
            </tr>
          </thead>
          <tbody>
            {terceros.map((equipo, idx) => {
              const clasifica = idx < 8;
              const filaClassName = `${styles.fila} ${clasifica ? styles.clasificado : styles.eliminado}`;
              
              return (
                <tr key={equipo.id} className={filaClassName}>
                  <td className={styles.tdPos}>
                    <div className={`${styles.posicion} ${clasifica ? styles.pos1a8 : styles.pos9a12}`}>
                      {equipo.posicion}
                    </div>
                  </td>
                  <td className={styles.tdEquipo}>
                    <div className={styles.equipoCell}>
                      <img 
                        src={equipo.bandera} 
                        alt={equipo.nombre}
                        onError={(e) => {e.target.style.display = 'none'}}
                        className={styles.bandera}
                      />
                      <span className={styles.nombre}>{equipo.nombre}</span>
                    </div>
                  </td>
                  <td className={styles.tdGrupo}>
                    <span className={styles.grupo}>Grupo {equipo.grupo}</span>
                  </td>
                  <td className={styles.tdNum}>{equipo.puntos}</td>
                  <td className={styles.tdNum}>{equipo.partidos_jugados}</td>
                  <td className={styles.tdNum}>{equipo.goles_a_favor}</td>
                  <td className={styles.tdNum}>{equipo.goles_en_contra}</td>
                  <td className={styles.tdNum}>{equipo.diferencia_goles}</td>
                  <td className={styles.tdEstado}>
                    {clasifica ? (
                      <span className={styles.clasificaSpan}>✓ Clasifica</span>
                    ) : (
                      <span className={styles.eliminadoSpan}>✗ Eliminado</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.nota}>
        <p>📋 <strong>Criterio de ordenamiento:</strong> Puntos (descendente) → Diferencia de goles (descendente)</p>
        <p>🎯 <strong>Clasifican:</strong> Los 8 mejores terceros al Round of 32</p>
      </div>
    </div>
  );
}
