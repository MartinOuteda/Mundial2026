import '@/styles/globals.css';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [seccionActual, setSeccionActual] = useState('grupos');

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="titulo">⚽ Simulador Mundial 2026</h1>
          <p className="subtitulo">Predecí los resultados y elige tu campeón</p>
        </div>
      </header>

      <nav className="navegacion">
        <div className="container">
          <button
            className={`nav-btn ${seccionActual === 'grupos' ? 'activo' : ''}`}
            onClick={() => setSeccionActual('grupos')}
          >
            ⚽ Fase de Grupos
          </button>
          <button
            className={`nav-btn ${seccionActual === 'terceros' ? 'activo' : ''}`}
            onClick={() => setSeccionActual('terceros')}
          >
            📊 3ros Clasificados
          </button>
          <button
            className={`nav-btn ${seccionActual === 'eliminatorio' ? 'activo' : ''}`}
            onClick={() => setSeccionActual('eliminatorio')}
          >
            🏆 Cuadro Eliminatorio
          </button>
          <button
            className={`nav-btn ${seccionActual === 'semifinales' ? 'activo' : ''}`}
            onClick={() => setSeccionActual('semifinales')}
          >
            🥇 Semifinales
          </button>
        </div>
      </nav>

      <main className="contenido">
        <div className="container">
          <Component {...pageProps} seccion={seccionActual} />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Simulador Mundial 2026 © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
