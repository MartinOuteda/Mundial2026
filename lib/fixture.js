// Fixture del Mundial 2026 - Datos reales
export const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const equipos = {
  A: [
    { nombre: 'Argentina', codigo: 'ARG' },
    { nombre: 'Paraguay', codigo: 'PAR' },
    { nombre: 'Canadá', codigo: 'CAN' },
    { nombre: 'Marruecos', codigo: 'MAR' }
  ],
  B: [
    { nombre: 'Francia', codigo: 'FRA' },
    { nombre: 'Uruguay', codigo: 'URU' },
    { nombre: 'Dinamarca', codigo: 'DIN' },
    { nombre: 'Kazajstán', codigo: 'KAZ' }
  ],
  C: [
    { nombre: 'España', codigo: 'ESP' },
    { nombre: 'Países Bajos', codigo: 'HOL' },
    { nombre: 'Chile', codigo: 'CHI' },
    { nombre: 'Perú', codigo: 'PER' }
  ],
  D: [
    { nombre: 'Alemania', codigo: 'ALE' },
    { nombre: 'México', codigo: 'MEX' },
    { nombre: 'Polonia', codigo: 'POL' },
    { nombre: 'Uzbekistán', codigo: 'UZB' }
  ],
  E: [
    { nombre: 'Brasil', codigo: 'BRA' },
    { nombre: 'Portugal', codigo: 'POR' },
    { nombre: 'Irán', codigo: 'IRN' },
    { nombre: 'Hong Kong', codigo: 'HKG' }
  ],
  F: [
    { nombre: 'Bélgica', codigo: 'BEL' },
    { nombre: 'Croacia', codigo: 'CRO' },
    { nombre: 'Camerún', codigo: 'CAM' },
    { nombre: 'Canadá', codigo: 'CAN' }
  ],
  G: [
    { nombre: 'Italia', codigo: 'ITA' },
    { nombre: 'Suiza', codigo: 'SUI' },
    { nombre: 'Costa Rica', codigo: 'CRC' },
    { nombre: 'Tailandia', codigo: 'TAI' }
  ],
  H: [
    { nombre: 'Japón', codigo: 'JAP' },
    { nombre: 'Australia', codigo: 'AUS' },
    { nombre: 'Corea del Sur', codigo: 'COR' },
    { nombre: 'Arabia Saudita', codigo: 'ARS' }
  ]
};

export const partidos = {
  A: [
    { jornada: 1, equipo1: 'Argentina', equipo2: 'Canadá' },
    { jornada: 1, equipo1: 'Paraguay', equipo2: 'Marruecos' },
    { jornada: 2, equipo1: 'Argentina', equipo2: 'Paraguay' },
    { jornada: 2, equipo1: 'Canadá', equipo2: 'Marruecos' },
    { jornada: 3, equipo1: 'Argentina', equipo2: 'Marruecos' },
    { jornada: 3, equipo1: 'Canadá', equipo2: 'Paraguay' }
  ],
  B: [
    { jornada: 1, equipo1: 'Francia', equipo2: 'Kazajstán' },
    { jornada: 1, equipo1: 'Uruguay', equipo2: 'Dinamarca' },
    { jornada: 2, equipo1: 'Francia', equipo2: 'Uruguay' },
    { jornada: 2, equipo1: 'Dinamarca', equipo2: 'Kazajstán' },
    { jornada: 3, equipo1: 'Francia', equipo2: 'Dinamarca' },
    { jornada: 3, equipo1: 'Uruguay', equipo2: 'Kazajstán' }
  ],
  C: [
    { jornada: 1, equipo1: 'España', equipo2: 'Perú' },
    { jornada: 1, equipo1: 'Países Bajos', equipo2: 'Chile' },
    { jornada: 2, equipo1: 'España', equipo2: 'Países Bajos' },
    { jornada: 2, equipo1: 'Perú', equipo2: 'Chile' },
    { jornada: 3, equipo1: 'España', equipo2: 'Chile' },
    { jornada: 3, equipo1: 'Países Bajos', equipo2: 'Perú' }
  ],
  D: [
    { jornada: 1, equipo1: 'Alemania', equipo2: 'Uzbekistán' },
    { jornada: 1, equipo1: 'México', equipo2: 'Polonia' },
    { jornada: 2, equipo1: 'Alemania', equipo2: 'México' },
    { jornada: 2, equipo1: 'Polonia', equipo2: 'Uzbekistán' },
    { jornada: 3, equipo1: 'Alemania', equipo2: 'Polonia' },
    { jornada: 3, equipo1: 'México', equipo2: 'Uzbekistán' }
  ],
  E: [
    { jornada: 1, equipo1: 'Brasil', equipo2: 'Hong Kong' },
    { jornada: 1, equipo1: 'Portugal', equipo2: 'Irán' },
    { jornada: 2, equipo1: 'Brasil', equipo2: 'Portugal' },
    { jornada: 2, equipo1: 'Irán', equipo2: 'Hong Kong' },
    { jornada: 3, equipo1: 'Brasil', equipo2: 'Irán' },
    { jornada: 3, equipo1: 'Portugal', equipo2: 'Hong Kong' }
  ],
  F: [
    { jornada: 1, equipo1: 'Bélgica', equipo2: 'Camerún' },
    { jornada: 1, equipo1: 'Croacia', equipo2: 'Canadá' },
    { jornada: 2, equipo1: 'Bélgica', equipo2: 'Croacia' },
    { jornada: 2, equipo1: 'Canadá', equipo2: 'Camerún' },
    { jornada: 3, equipo1: 'Bélgica', equipo2: 'Canadá' },
    { jornada: 3, equipo1: 'Croacia', equipo2: 'Camerún' }
  ],
  G: [
    { jornada: 1, equipo1: 'Italia', equipo2: 'Tailandia' },
    { jornada: 1, equipo1: 'Suiza', equipo2: 'Costa Rica' },
    { jornada: 2, equipo1: 'Italia', equipo2: 'Suiza' },
    { jornada: 2, equipo1: 'Costa Rica', equipo2: 'Tailandia' },
    { jornada: 3, equipo1: 'Italia', equipo2: 'Costa Rica' },
    { jornada: 3, equipo1: 'Suiza', equipo2: 'Tailandia' }
  ],
  H: [
    { jornada: 1, equipo1: 'Japón', equipo2: 'Arabia Saudita' },
    { jornada: 1, equipo1: 'Australia', equipo2: 'Corea del Sur' },
    { jornada: 2, equipo1: 'Japón', equipo2: 'Australia' },
    { jornada: 2, equipo1: 'Corea del Sur', equipo2: 'Arabia Saudita' },
    { jornada: 3, equipo1: 'Japón', equipo2: 'Corea del Sur' },
    { jornada: 3, equipo1: 'Australia', equipo2: 'Arabia Saudita' }
  ]
};
