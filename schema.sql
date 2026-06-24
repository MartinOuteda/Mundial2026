-- Crear tabla de equipos
CREATE TABLE IF NOT EXISTS equipos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  grupo CHAR(1) NOT NULL,
  pais_codigo CHAR(2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de partidos (fase grupos)
CREATE TABLE IF NOT EXISTS partidos_grupos (
  id SERIAL PRIMARY KEY,
  equipo_1_id INTEGER NOT NULL REFERENCES equipos(id),
  equipo_2_id INTEGER NOT NULL REFERENCES equipos(id),
  goles_1 INTEGER,
  goles_2 INTEGER,
  grupo CHAR(1) NOT NULL,
  jornada INTEGER NOT NULL,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de tabla de posiciones (cache)
CREATE TABLE IF NOT EXISTS tabla_posiciones (
  id SERIAL PRIMARY KEY,
  equipo_id INTEGER NOT NULL REFERENCES equipos(id),
  grupo CHAR(1) NOT NULL,
  partidos_jugados INTEGER DEFAULT 0,
  victorias INTEGER DEFAULT 0,
  empates INTEGER DEFAULT 0,
  derrotas INTEGER DEFAULT 0,
  goles_a_favor INTEGER DEFAULT 0,
  goles_en_contra INTEGER DEFAULT 0,
  puntos INTEGER DEFAULT 0,
  clasificado BOOLEAN DEFAULT FALSE,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla de terceros clasificados
CREATE TABLE IF NOT EXISTS terceros_clasificados (
  id SERIAL PRIMARY KEY,
  equipo_id INTEGER NOT NULL REFERENCES equipos(id),
  grupo CHAR(1) NOT NULL,
  puntos INTEGER DEFAULT 0,
  diferencia_goles INTEGER DEFAULT 0,
  goles_a_favor INTEGER DEFAULT 0,
  clasificado BOOLEAN DEFAULT FALSE,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear tabla para cuadro eliminatorio
CREATE TABLE IF NOT EXISTS cuadro_eliminatorio (
  id SERIAL PRIMARY KEY,
  fase VARCHAR(50) NOT NULL, -- 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final', 'Third Place'
  partido_numero INTEGER NOT NULL,
  equipo_1_id INTEGER REFERENCES equipos(id),
  equipo_2_id INTEGER REFERENCES equipos(id),
  ganador_id INTEGER REFERENCES equipos(id),
  goles_1 INTEGER,
  goles_2 INTEGER,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_equipos_grupo ON equipos(grupo);
CREATE INDEX IF NOT EXISTS idx_partidos_grupo ON partidos_grupos(grupo);
CREATE INDEX IF NOT EXISTS idx_tabla_grupo ON tabla_posiciones(grupo);
CREATE INDEX IF NOT EXISTS idx_cuadro_fase ON cuadro_eliminatorio(fase);
