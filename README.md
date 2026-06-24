# ⚽ Simulador Mundial 2026

Simulador interactivo del Mundial 2026 donde podés predecir resultados en:
- ⚽ Fase de Grupos
- 📊 Terceros Clasificados
- 🏆 Cuadro Eliminatorio (16avos hasta Final)

Los resultados se guardan automáticamente en **Neon PostgreSQL**.

---

## 🚀 Setup Rápido

### 1. Clonar o descargar el proyecto
```bash
cd mundial-2026-simulator
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

**Copiar el archivo de ejemplo:**
```bash
cp .env.example .env.local
```

**Editar `.env.local` con tu `DATABASE_URL` de Neon:**
```
DATABASE_URL=postgresql://user:password@region.neon.tech/dbname?sslmode=require
```

### 4. Crear la base de datos

Conectarse a Neon y ejecutar el script `schema.sql`:

```bash
# Opción 1: Desde la línea de comandos (si tienes psql instalado)
psql $DATABASE_URL -f schema.sql

# Opción 2: Copiar y pegar el contenido de schema.sql en el editor SQL de Neon
```

### 5. Cargar datos iniciales (opcional)

Ejecutar el script para insertar equipos y partidos:
```bash
node scripts/cargar-datos.js
```

### 6. Desarrollo local
```bash
npm run dev
```

Visitar: http://localhost:3000

---

## 📋 Instalación de Neon (si no lo tenés)

1. **Crear cuenta:** https://console.neon.tech/
2. **Crear proyecto** con PostgreSQL
3. **Obtener `DATABASE_URL`** desde Settings > Connection String
4. **Copiar en `.env.local`**

---

## 🚢 Deploy en Netlify

### 1. Crear repositorio en GitHub
```bash
git init
git add .
git commit -m "Initial commit: Simulador Mundial 2026"
git branch -M main
git remote add origin https://github.com/tuusuario/mundial-2026-simulator.git
git push -u origin main
```

### 2. Conectar con Netlify
- Ir a https://app.netlify.com
- **New site from Git** → Seleccionar el repositorio
- Build settings automáticos (ya está configurado en `netlify.toml`)
- Agregar variable de entorno: `DATABASE_URL`

### 3. Deploy automático
- Cada push a `main` hará deploy automáticamente
- Las Netlify Functions funcionarán sin configuración adicional

---

## 📂 Estructura del Proyecto

```
mundial-2026-simulator/
├── components/              # Componentes React
│   ├── FaseGrupos.js
│   ├── TercerClasificado.js
│   └── CuadroEliminatorio.js
├── pages/                   # Páginas Next.js
│   ├── _app.js
│   ├── _document.js
│   └── index.js
├── lib/                     # Funciones utilitarias
│   ├── fixture.js          # Datos del Mundial 2026
│   └── db.js               # Conexión y queries a BD
├── netlify/
│   └── functions/           # API functions serverless
│       ├── guardar-resultado.js
│       ├── obtener-grupo.js
│       ├── obtener-terceros.js
│       ├── obtener-cuadro.js
│       └── guardar-ganador.js
├── styles/                  # Estilos CSS
│   ├── globals.css
│   ├── FaseGrupos.module.css
│   ├── TercerClasificado.module.css
│   └── CuadroEliminatorio.module.css
├── public/                  # Archivos estáticos
├── schema.sql              # Esquema de base de datos
├── .env.example            # Variables de entorno (ejemplo)
├── netlify.toml            # Configuración de Netlify
├── jsconfig.json           # Configuración de rutas alias
├── next.config.js          # Configuración de Next.js
└── package.json
```

---

## 🔧 Flujo de Uso

### Fase de Grupos
1. Ingresá los goles de cada partido
2. Las tablas se calculan automáticamente
3. Guardá los resultados (se persisten en Neon)

### Terceros Clasificados
1. Se cargan automáticamente después de completar grupos
2. Muestran los 8 mejores terceros que clasifican
3. Criterio: Puntos → Diferencia de goles → Goles a favor

### Cuadro Eliminatorio
1. Seleccioná el equipo ganador de cada partido
2. Los ganadores avanzan automáticamente
3. Podés ver el campeón después de la final

---

## 📊 Base de Datos

### Tablas principales:
- **equipos**: Equipos participantes (país, grupo)
- **partidos_grupos**: Partidos de la fase de grupos
- **tabla_posiciones**: Cache actualizado de standings
- **terceros_clasificados**: Terceros lugares calculados
- **cuadro_eliminatorio**: Partidos del cuadro y ganadores

---

## 🐛 Troubleshooting

### "Error connecting to database"
- Verificar `DATABASE_URL` en `.env.local`
- Asegurar que Neon está activo
- Comprobar que la contraseña no tiene caracteres especiales sin escapar

### "Port 3000 is already in use"
```bash
npm run dev -- -p 3001
```

### "Cambios no se guardan"
- Verificar que `DATABASE_URL` está configurado en Netlify
- Revisar los logs de Netlify Functions

---

## 📝 Notas

- El proyecto usa **Next.js 14** con **export estático** optimizado para Netlify
- Las **Netlify Functions** manejan toda la lógica del backend
- **PostgreSQL (Neon)** almacena todos los datos
- Los estilos usan **CSS Modules** para evitar conflictos

---

## 🎯 Próximos pasos

1. Personalizar equipos/grupos si es necesario
2. Agregar autenticación si querés múltiples usuarios
3. Mejorar la UI con más animaciones
4. Exportar resultados a PDF

---

## 📄 Licencia

Proyecto personal. Úsalo como quieras.

---

¿Necesitas ayuda? Revisá el código en los comentarios o contactá al desarrollador.
