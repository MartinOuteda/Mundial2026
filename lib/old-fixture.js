export const grupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

export const equipos = {
  A: [
    { nombre: 'México', codigo: 'MEX', bandera: '🇲🇽' },
    { nombre: 'Sudáfrica', codigo: 'SUD', bandera: '🇿🇦' },
    { nombre: 'Corea del Sur', codigo: 'COR', bandera: '🇰🇷' },
    { nombre: 'Czechia', codigo: 'CZE', bandera: '🇨🇿' }
  ],
  B: [
    { nombre: 'Canadá', codigo: 'CAN', bandera: '🇨🇦' },
    { nombre: 'Bosnia', codigo: 'BIH', bandera: '🇧🇦' },
    { nombre: 'Qatar', codigo: 'QAT', bandera: '🇶🇦' },
    { nombre: 'Suiza', codigo: 'SUI', bandera: '🇨🇭' }
  ],
  C: [
    { nombre: 'Brasil', codigo: 'BRA', bandera: '🇧🇷' },
    { nombre: 'Marruecos', codigo: 'MAR', bandera: '🇲🇦' },
    { nombre: 'Haití', codigo: 'HAI', bandera: '🇭🇹' },
    { nombre: 'Escocia', codigo: 'ESC', bandera: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }
  ],
  D: [
    { nombre: 'USA', codigo: 'USA', bandera: '🇺🇸' },
    { nombre: 'Paraguay', codigo: 'PAR', bandera: '🇵🇾' },
    { nombre: 'Australia', codigo: 'AUS', bandera: '🇦🇺' },
    { nombre: 'Turquía', codigo: 'TUR', bandera: '🇹🇷' }
  ],
  E: [
    { nombre: 'Alemania', codigo: 'ALE', bandera: '🇩🇪' },
    { nombre: 'Curazao', codigo: 'CUW', bandera: '🇨🇼' },
    { nombre: 'Costa de Marfil', codigo: 'CIV', bandera: '🇨🇮' },
    { nombre: 'Ecuador', codigo: 'ECU', bandera: '🇪🇨' }
  ],
  F: [
    { nombre: 'Países Bajos', codigo: 'HOL', bandera: '🇳🇱' },
    { nombre: 'Japón', codigo: 'JAP', bandera: '🇯🇵' },
    { nombre: 'Suecia', codigo: 'SUE', bandera: '🇸🇪' },
    { nombre: 'Túnez', codigo: 'TUN', bandera: '🇹🇳' }
  ],
  G: [
    { nombre: 'Bélgica', codigo: 'BEL', bandera: '🇧🇪' },
    { nombre: 'Egipto', codigo: 'EGY', bandera: '🇪🇬' },
    { nombre: 'Irán', codigo: 'IRN', bandera: '🇮🇷' },
    { nombre: 'Nueva Zelanda', codigo: 'NZL', bandera: '🇳🇿' }
  ],
  H: [
    { nombre: 'España', codigo: 'ESP', bandera: '🇪🇸' },
    { nombre: 'Cabo Verde', codigo: 'CPV', bandera: '🇨🇻' },
    { nombre: 'Arabia Saudita', codigo: 'ARS', bandera: '🇸🇦' },
    { nombre: 'Uruguay', codigo: 'URU', bandera: '🇺🇾' }
  ],
  I: [
    { nombre: 'Francia', codigo: 'FRA', bandera: '🇫🇷' },
    { nombre: 'Senegal', codigo: 'SEN', bandera: '🇸🇳' },
    { nombre: 'Irak', codigo: 'IRQ', bandera: '🇮🇶' },
    { nombre: 'Noruega', codigo: 'NOR', bandera: '🇳🇴' }
  ],
  J: [
    { nombre: 'Argentina', codigo: 'ARG', bandera: '🇦🇷' },
    { nombre: 'Argelia', codigo: 'ALG', bandera: '🇩🇿' },
    { nombre: 'Austria', codigo: 'AUT', bandera: '🇦🇹' },
    { nombre: 'Jordania', codigo: 'JOR', bandera: '🇯🇴' }
  ],
  K: [
    { nombre: 'Portugal', codigo: 'POR', bandera: '🇵🇹' },
    { nombre: 'República del Congo', codigo: 'COG', bandera: '🇨🇬' },
    { nombre: 'Uzbekistán', codigo: 'UZB', bandera: '🇺🇿' },
    { nombre: 'Colombia', codigo: 'COL', bandera: '🇨🇴' }
  ],
  L: [
    { nombre: 'Inglaterra', codigo: 'ING', bandera: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { nombre: 'Croacia', codigo: 'CRO', bandera: '🇭🇷' },
    { nombre: 'Ghana', codigo: 'GHA', bandera: '🇬🇭' },
    { nombre: 'Panamá', codigo: 'PAN', bandera: '🇵🇦' }
  ]
};

export const partidos = {
  A: [
    { equipo1: 'México', equipo2: 'Sudáfrica' },
    { equipo1: 'Corea del Sur', equipo2: 'Czechia' },
    { equipo1: 'México', equipo2: 'Corea del Sur' },
    { equipo1: 'Sudáfrica', equipo2: 'Czechia' },
    { equipo1: 'México', equipo2: 'Czechia' },
    { equipo1: 'Sudáfrica', equipo2: 'Corea del Sur' }
  ],
  B: [
    { equipo1: 'Canadá', equipo2: 'Bosnia' },
    { equipo1: 'Qatar', equipo2: 'Suiza' },
    { equipo1: 'Canadá', equipo2: 'Qatar' },
    { equipo1: 'Bosnia', equipo2: 'Suiza' },
    { equipo1: 'Canadá', equipo2: 'Suiza' },
    { equipo1: 'Bosnia', equipo2: 'Qatar' }
  ],
  C: [
    { equipo1: 'Brasil', equipo2: 'Marruecos' },
    { equipo1: 'Haití', equipo2: 'Escocia' },
    { equipo1: 'Brasil', equipo2: 'Haití' },
    { equipo1: 'Marruecos', equipo2: 'Escocia' },
    { equipo1: 'Brasil', equipo2: 'Escocia' },
    { equipo1: 'Marruecos', equipo2: 'Haití' }
  ],
  D: [
    { equipo1: 'USA', equipo2: 'Paraguay' },
    { equipo1: 'Australia', equipo2: 'Turquía' },
    { equipo1: 'USA', equipo2: 'Australia' },
    { equipo1: 'Paraguay', equipo2: 'Turquía' },
    { equipo1: 'USA', equipo2: 'Turquía' },
    { equipo1: 'Paraguay', equipo2: 'Australia' }
  ],
  E: [
    { equipo1: 'Alemania', equipo2: 'Curazao' },
    { equipo1: 'Costa de Marfil', equipo2: 'Ecuador' },
    { equipo1: 'Alemania', equipo2: 'Costa de Marfil' },
    { equipo1: 'Curazao', equipo2: 'Ecuador' },
    { equipo1: 'Alemania', equipo2: 'Ecuador' },
    { equipo1: 'Curazao', equipo2: 'Costa de Marfil' }
  ],
  F: [
    { equipo1: 'Países Bajos', equipo2: 'Japón' },
    { equipo1: 'Suecia', equipo2: 'Túnez' },
    { equipo1: 'Países Bajos', equipo2: 'Suecia' },
    { equipo1: 'Japón', equipo2: 'Túnez' },
    { equipo1: 'Países Bajos', equipo2: 'Túnez' },
    { equipo1: 'Japón', equipo2: 'Suecia' }
  ],
  G: [
    { equipo1: 'Bélgica', equipo2: 'Egipto' },
    { equipo1: 'Irán', equipo2: 'Nueva Zelanda' },
    { equipo1: 'Bélgica', equipo2: 'Irán' },
    { equipo1: 'Egipto', equipo2: 'Nueva Zelanda' },
    { equipo1: 'Bélgica', equipo2: 'Nueva Zelanda' },
    { equipo1: 'Egipto', equipo2: 'Irán' }
  ],
  H: [
    { equipo1: 'España', equipo2: 'Cabo Verde' },
    { equipo1: 'Arabia Saudita', equipo2: 'Uruguay' },
    { equipo1: 'España', equipo2: 'Arabia Saudita' },
    { equipo1: 'Cabo Verde', equipo2: 'Uruguay' },
    { equipo1: 'España', equipo2: 'Uruguay' },
    { equipo1: 'Cabo Verde', equipo2: 'Arabia Saudita' }
  ],
  I: [
    { equipo1: 'Francia', equipo2: 'Senegal' },
    { equipo1: 'Irak', equipo2: 'Noruega' },
    { equipo1: 'Francia', equipo2: 'Irak' },
    { equipo1: 'Senegal', equipo2: 'Noruega' },
    { equipo1: 'Francia', equipo2: 'Noruega' },
    { equipo1: 'Senegal', equipo2: 'Irak' }
  ],
  J: [
    { equipo1: 'Argentina', equipo2: 'Argelia' },
    { equipo1: 'Austria', equipo2: 'Jordania' },
    { equipo1: 'Argentina', equipo2: 'Austria' },
    { equipo1: 'Argelia', equipo2: 'Jordania' },
    { equipo1: 'Argentina', equipo2: 'Jordania' },
    { equipo1: 'Argelia', equipo2: 'Austria' }
  ],
  K: [
    { equipo1: 'Portugal', equipo2: 'República del Congo' },
    { equipo1: 'Uzbekistán', equipo2: 'Colombia' },
    { equipo1: 'Portugal', equipo2: 'Uzbekistán' },
    { equipo1: 'República del Congo', equipo2: 'Colombia' },
    { equipo1: 'Portugal', equipo2: 'Colombia' },
    { equipo1: 'República del Congo', equipo2: 'Uzbekistán' }
  ],
  L: [
    { equipo1: 'Inglaterra', equipo2: 'Croacia' },
    { equipo1: 'Ghana', equipo2: 'Panamá' },
    { equipo1: 'Inglaterra', equipo2: 'Ghana' },
    { equipo1: 'Croacia', equipo2: 'Panamá' },
    { equipo1: 'Inglaterra', equipo2: 'Panamá' },
    { equipo1: 'Croacia', equipo2: 'Ghana' }
  ]
};
