import { useState, useEffect } from 'react';
import styles from '@/styles/TercerClasificado.module.css';

export default function TercerClasificado() {
  const [terceros, setTerceros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [indiceEditando, setIndiceEditando] = useState('');

  useEffect(() => {
    cargarTerceros();
  }, []);

  const cargarTerceros = async () => {
    try {
      const res = await fetch('/.netlify/functions/obtener-terceros');
      const data = await res.json();
      setTerceros(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const guardarIndice = async (equipoId) => {
    const indice = indiceEditando.trim() ? parseInt(indiceEditando) : null;

    if (indice && (indice < 1 || indice > 8)) {
      alert('El índice debe ser entre 1 y 8');
      return;
    }

    try {
      const res = await fetch('/.netlify/functions/guardar-indice-orden', {
        method: 'POST',
        body: JSON.stringify({
          equipoId: parseInt(equipoId),
          indiceOrden: indice
        })
      });

      if (res.ok) {
        setEditandoId(null);
        setIndiceEditando('');
        cargarTerceros();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>TERCEROS <span className={styles.gold}>CLASIFICADOS</span></h1>
        <p>Los 8 mejores terceros de los 12 grupos avanzan al cuadro eliminatorio.</p>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>EQUIPO</th>
              <th>GRUPO</th>
              <th>PTS</th>
              <th>PJ</th>
              <th>GF</th>
              <th>GC</th>
              <th>DG</th>
              <th>ESTADO</th>
              <th>ÍNDICE</th>
            </tr>
          </thead>
          <tbody>
            {terceros.map((tercero, idx) => (
              <tr key={tercero.id} className={idx < 8 ? styles.mejoresOcho : ''}>
                <td className={styles.numero}>{idx + 1}</td>
                <td className={styles.equipo}>{tercero.nombre_equipo || tercero.equipo || '?'}</td>
                <td className={styles.grupo}>{tercero.grupo || '-'}</td>
                <td>{tercero.pts || 0}</td>
                <td>{tercero.pj || 0}</td>
                <td>{tercero.gf || 0}</td>
                <td>{tercero.gc || 0}</td>
                <td>{tercero.dg !== undefined ? tercero.dg : 0}</td>
                <td className={styles.estado}>✓ Clasifica</td>
                <td className={styles.indice}>
                  {editandoId === tercero.id ? (
                    <div className={styles.indiceEdit}>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={indiceEditando}
                        onChange={(e) => setIndiceEditando(e.target.value)}
                        className={styles.indiceInput}
                      />
                      <button 
                        className={styles.btnSave}
                        onClick={() => guardarIndice(tercero.id)}
                      >
                        ✓
                      </button>
                      <button 
                        className={styles.btnCancel}
                        onClick={() => setEditandoId(null)}
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <div
                      className={styles.indiceDisplay}
                      onClick={() => {
                        setEditandoId(tercero.id);
                        setIndiceEditando(tercero.indice_orden || '');
                      }}
                    >
                      {tercero.indice_orden || '-'}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
