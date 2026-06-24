export const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const equipos = {
  A: [
    { nombre: 'Argentina', codigo: 'ARG', bandera: '🇦🇷' },
    { nombre: 'Paraguay', codigo: 'PAR', bandera: '🇵🇾' },
    { nombre: 'Canadá', codigo: 'CAN', bandera: '🇨🇦' },
    { nombre: 'Marruecos', codigo: 'MAR', bandera: '🇲🇦' }
  ],
  B: [
    { nombre: 'Francia', codigo: 'FRA', bandera: '🇫🇷' },
    { nombre: 'Uruguay', codigo: 'URU', bandera: '🇺🇾' },
    { nombre: 'Dinamarca', codigo: 'DIN', bandera: '🇩🇰' },
    { nombre: 'Kazajstán', codigo: 'KAZ', bandera: '🇰🇿' }
  ],
  C: [
    { nombre: 'España', codigo: 'ESP', bandera: '🇪🇸' },
    { nombre: 'Países Bajos', codigo: 'HOL', bandera: '🇳🇱' },
    { nombre: 'Chile', codigo: 'CHI', bandera: '🇨🇱' },
    { nombre: 'Perú', codigo: 'PER', bandera: '🇵🇪' }
  ],
  D: [
    { nombre: 'Alemania', codigo: 'ALE', bandera: '🇩🇪' },
    { nombre: 'México', codigo: 'MEX', bandera: '🇲🇽' },
    { nombre: 'Polonia', codigo: 'POL', bandera: '🇵🇱' },
    { nombre: 'Uzbekistán', codigo: 'UZB', bandera: '🇺🇿' }
  ],
  E: [
    { nombre: 'Brasil', codigo: 'BRA', bandera: '🇧🇷' },
    { nombre: 'Portugal', codigo: 'POR', bandera: '🇵🇹' },
    { nombre: 'Irán', codigo: 'IRN', bandera: '🇮🇷' },
    { nombre: 'Hong Kong', codigo: 'HKG', bandera: '🇭🇰' }
  ],
  F: [
    { nombre: 'Bélgica', codigo: 'BEL', bandera: '🇧🇪' },
    { nombre: 'Croacia', codigo: 'CRO', bandera: '🇭🇷' },
    { nombre: 'Camerún', codigo: 'CAM', bandera: '🇨🇲' },
    { nombre: 'Irak', codigo: 'IRQ', bandera: '🇮🇶' }
  ],
  G: [
    { nombre: 'Italia', codigo: 'ITA', bandera: '🇮🇹' },
    { nombre: 'Suiza', codigo: 'SUI', bandera: '🇨🇭' },
    { nombre: 'Costa Rica', codigo: 'CRC', bandera: '🇨🇷' },
    { nombre: 'Tailandia', codigo: 'TAI', bandera: '🇹🇭' }
  ],
  H: [
    { nombre: 'Japón', codigo: 'JAP', bandera: '🇯🇵' },
    { nombre: 'Australia', codigo: 'AUS', bandera: '🇦🇺' },
    { nombre: 'Corea del Sur', codigo: 'COR', bandera: '🇰🇷' },
    { nombre: 'Arabia Saudita', codigo: 'ARS', bandera: '🇸🇦' }
  ]
};

export const partidos = {
  A: [
    { equipo1: 'Argentina', equipo2: 'Canadá' },
    { equipo1: 'Paraguay', equipo2: 'Marruecos' },
    { equipo1: 'Argentina', equipo2: 'Paraguay' },
    { equipo1: 'Canadá', equipo2: 'Marruecos' },
    { equipo1: 'Argentina', equipo2: 'Marruecos' },
    { equipo1: 'Canadá', equipo2: 'Paraguay' }
  ],
  B: [
    { equipo1: 'Francia', equipo2: 'Kazajstán' },
    { equipo1: 'Uruguay', equipo2: 'Dinamarca' },
    { equipo1: 'Francia', equipo2: 'Uruguay' },
    { equipo1: 'Dinamarca', equipo2: 'Kazajstán' },
    { equipo1: 'Francia', equipo2: 'Dinamarca' },
    { equipo1: 'Uruguay', equipo2: 'Kazajstán' }
  ],
  C: [
    { equipo1: 'España', equipo2: 'Perú' },
    { equipo1: 'Países Bajos', equipo2: 'Chile' },
    { equipo1: 'España', equipo2: 'Países Bajos' },
    { equipo1: 'Perú', equipo2: 'Chile' },
    { equipo1: 'España', equipo2: 'Chile' },
    { equipo1: 'Países Bajos', equipo2: 'Perú' }
  ],
  D: [
    { equipo1: 'Alemania', equipo2: 'Uzbekistán' },
    { equipo1: 'México', equipo2: 'Polonia' },
    { equipo1: 'Alemania', equipo2: 'México' },
    { equipo1: 'Polonia', equipo2: 'Uzbekistán' },
    { equipo1: 'Alemania', equipo2: 'Polonia' },
    { equipo1: 'México', equipo2: 'Uzbekistán' }
  ],
  E: [
    { equipo1: 'Brasil', equipo2: 'Hong Kong' },
    { equipo1: 'Portugal', equipo2: 'Irán' },
    { equipo1: 'Brasil', equipo2: 'Portugal' },
    { equipo1: 'Irán', equipo2: 'Hong Kong' },
    { equipo1: 'Brasil', equipo2: 'Irán' },
    { equipo1: 'Portugal', equipo2: 'Hong Kong' }
  ],
  F: [
    { equipo1: 'Bélgica', equipo2: 'Camerún' },
    { equipo1: 'Croacia', equipo2: 'Irak' },
    { equipo1: 'Bélgica', equipo2: 'Croacia' },
    { equipo1: 'Irak', equipo2: 'Camerún' },
    { equipo1: 'Bélgica', equipo2: 'Irak' },
    { equipo1: 'Croacia', equipo2: 'Camerún' }
  ],
  G: [
    { equipo1: 'Italia', equipo2: 'Tailandia' },
    { equipo1: 'Suiza', equipo2: 'Costa Rica' },
    { equipo1: 'Italia', equipo2: 'Suiza' },
    { equipo1: 'Costa Rica', equipo2: 'Tailandia' },
    { equipo1: 'Italia', equipo2: 'Costa Rica' },
    { equipo1: 'Suiza', equipo2: 'Tailandia' }
  ],
  H: [
    { equipo1: 'Japón', equipo2: 'Arabia Saudita' },
    { equipo1: 'Australia', equipo2: 'Corea del Sur' },
    { equipo1: 'Japón', equipo2: 'Australia' },
    { equipo1: 'Corea del Sur', equipo2: 'Arabia Saudita' },
    { equipo1: 'Japón', equipo2: 'Corea del Sur' },
    { equipo1: 'Australia', equipo2: 'Arabia Saudita' }
  ]
};
