import { useState, useEffect } from 'react';
import styles from '@/styles/TercerClasificado.module.css';

export default function TercerClasificado() {
  const [terceros, setTerceros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [indiceEditando, setIndiceEditando] = useState('');

  useEffect(() => {
    cargarTerceros();
  }, []);

  const cargarTerceros = async () => {
    try {
      console.log('Iniciando carga de terceros...');
      const res = await fetch('/.netlify/functions/obtener-terceros');
      console.log('Response status:', res.status);
      
      const response = await res.json();
      console.log('Response completa:', response);
      
      let data = response.body ? JSON.parse(response.body) : response;
      console.log('Data procesada:', data);
      console.log('¿Es array?', Array.isArray(data));
      
      // Garantizar que es array
      const arrayData = Array.isArray(data) ? data : [];
      console.log('Array final:', arrayData);
      
      setTerceros(arrayData);
      setError(null);
    } catch (err) {
      console.error('Error cargando terceros:', err);
      setError(err.message);
      setTerceros([]);
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
      } else {
        alert('Error guardando índice');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (cargando) return <div className={styles.cargando}>Cargando...</div>;

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ color: 'red', padding: '20px' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!terceros || terceros.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ color: 'orange', padding: '20px' }}>
          No hay datos de terceros
        </div>
      </div>
    );
  }

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
              <tr key={tercero.id || idx}>
                <td className={styles.numero}>
                  <div className={styles.circulo}>{idx + 1}</div>
                </td>
                <td className={styles.equipo}>
                  <span>{tercero.equipo || '?'}</span>
                </td>
                <td className={styles.grupo}>{tercero.grupo || '-'}</td>
                <td>{tercero.pts || '-'}</td>
                <td>{tercero.pj || '-'}</td>
                <td>{tercero.gf || '-'}</td>
                <td>{tercero.gc || '-'}</td>
                <td>{tercero.dg !== undefined ? tercero.dg : '-'}</td>
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
                        placeholder="1-8"
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
                      {tercero.indice_orden ? (
                        <span className={styles.indiceValor}>{tercero.indice_orden}</span>
                      ) : (
                        <span className={styles.indiceVacio}>-</span>
                      )}
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
