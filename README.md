# ![FilmNest Logo](https://github.com/xrev4n/FilmNest/blob/main/src/assets/img/logo-no-margin.png?raw=true)

Una plataforma web moderna para explorar y descubrir películas, construida con Angular e integrada con la API de TMDB. FilmNest ofrece una experiencia de usuario intuitiva con diseño responsive y funcionalidades avanzadas de búsqueda y navegación.

[![Ver en GitHub Pages](https://img.shields.io/badge/🔗%20Ver%20Demo-GitHub%20Pages-blue?style=for-the-badge)](https://xrev4n.github.io/FilmNest/)

## ✨ Características Actuales

- 🎯 **Diseño Minimalista**: Interfaz limpia y moderna con Material Design
- 📱 **Totalmente Responsivo**: Optimizado para móviles, tablets y escritorio
- 🌙 **Modo Oscuro/Claro**: Tema personalizable con persistencia automática
- 🔍 **Búsqueda Avanzada**: Búsqueda en tiempo real con resultados paginados
- 📄 **Paginación Inteligente**: Navegación fluida entre páginas de resultados
- 🎭 **Detalles Completos**: Información exhaustiva de cada película
- ⭐ **Calificaciones y Metadatos**: Visualización de puntuaciones, géneros y fechas
- 🎨 **Material Design**: Componentes de Angular Material con animaciones suaves
- 🎬 **Navegación por Géneros**: Filtrado dinámico por categorías de películas
- 👥 **Detalles de Actores**: Información completa de elencos y filmografías
- 🎥 **Tráileres Integrados**: Visualización de tráileres de YouTube
- 🖼️ **Imágenes de Alta Calidad**: Backdrops y posters en máxima resolución
- 📊 **Información Financiera**: Presupuesto, recaudación y estadísticas
- 🌍 **Información Internacional**: Países de producción y detalles de lanzamiento

## 🚀 Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/xrev4n/FilmNest.git
   cd FilmNest
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura la API Key de TMDB y SUPABASE**

🔑 Obtener API Key de TMDB
Para usar la API de películas, necesitas obtener una API key gratuita de [TMDB](https://www.themoviedb.org):

1. Ve a [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
2. Crea una cuenta gratuita (si aún no tienes una)
3. Dirígete a "API" en el panel de usuario
4. Solicita una API Key (elige "Developer Key")
5. Copia tu API key

🛠️ Obtener URL y API Key de Supabase
Para conectar tu proyecto a Supabase:

1. Ve a [https://supabase.com/](https://supabase.com/) y crea una cuenta
2. Crea un nuevo proyecto
3. Una vez creado, ve al **Project Settings > API**
4. Copia:
   - La **URL del proyecto** (por ejemplo, `https://xxxxx.supabase.co`)
   - La **anon public key** (clave pública) que usarás en el frontend

> ⚠️ **No uses la service_role key en el frontend**, ya que tiene permisos administrativos.

🧪 Crear archivo `environment.ts`
En tu proyecto Angular, crea o edita el archivo `src/environments/environment.ts` con el siguiente contenido, reemplazando los valores con los tuyos:

```ts
export const environment = {
  production: false,
  tmdbApiKey: 'tu_api_key_tmdb_aqui',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
  supabaseUrl: 'https://tu_proyecto.supabase.co',
  supabaseKey: 'tu_anon_public_key_aqui'
};
```

4. **Ejecuta la aplicación**
   ```bash
   npm start
   ```

5. **Abre tu navegador**
   
   La aplicación estará disponible en `http://localhost:4200`

## 🛠️ Tecnologías Utilizadas

- **Angular 19**: Framework principal con arquitectura modular
- **Angular Material**: Componentes de UI con Material Design
- **TMDB API**: API completa de datos de películas y series
- **TypeScript**: Lenguaje de programación tipado
- **SCSS**: Estilos avanzados con variables CSS personalizadas
- **RxJS**: Programación reactiva para manejo de datos
- **Supabase**: Backend as a Service para autenticación y base de datos

## 📱 Funcionalidades Actuales

### 🏠 Página Principal (Home)
- **Catálogo de Películas Populares**: Lista dinámica con paginación
- **Barra de Búsqueda Inteligente**: Búsqueda en tiempo real con filtrado
- **Side Menu Avanzado**: Navegación lateral con categorías y tema
- **Filtrado por Géneros**: Acceso directo a categorías específicas
- **Modo Oscuro/Claro**: Toggle de tema con persistencia global
- **Diseño de Tarjetas**: Hover effects y información detallada

### 🎬 Detalle de Película
- **Información Completa**: Título, sinopsis, metadatos y estadísticas
- **Galería de Imágenes**: Backdrops aleatorios y posters en alta calidad
- **Información Financiera**: Presupuesto, recaudación y análisis de rentabilidad
- **Elenco Completo**: Lista de actores con paginación y detalles
- **Películas Recomendadas**: Sugerencias personalizadas basadas en la película
- **Tráileres Integrados**: Visualización de tráileres oficiales
- **Información Internacional**: Países de producción y fechas de lanzamiento
- **Géneros Interactivos**: Navegación directa a páginas de género

### 🎭 Detalle de Actor
- **Perfil Completo**: Biografía, información personal y estadísticas
- **Filmografía Detallada**: Películas como actor y crew con paginación
- **Imágenes de Fondo**: Backdrops aleatorios de sus películas
- **Información Personal**: Fecha de nacimiento, lugar de origen, edad
- **Carrera Profesional**: Departamentos y trabajos específicos

### 🏷️ Páginas de Género
- **Filtrado por Categoría**: Películas específicas de cada género
- **Paginación Avanzada**: Navegación fluida entre resultados
- **Diseño Consistente**: Misma experiencia que la página principal

### 🔐 Sistema de Autenticación
- **Login/Registro**: Sistema de autenticación con Supabase
- **Persistencia de Sesión**: Mantenimiento de estado de usuario
- **Interfaz Moderna**: Diseño atractivo con animaciones de fondo

## 🎨 Diseño y UX

### Principios de Diseño
- **Material Design**: Componentes consistentes y accesibles
- **Responsive First**: Diseño optimizado para todos los dispositivos
- **Accesibilidad**: Navegación por teclado y lectores de pantalla
- **Performance**: Carga optimizada y lazy loading

### Sistema de Temas
- **Modo Claro**: Colores vibrantes y legibles
- **Modo Oscuro**: Reducción de fatiga visual
- **Persistencia Global**: Tema mantenido en todas las páginas
- **Transiciones Suaves**: Cambios de tema con animaciones

### Responsive Design
- **Desktop (1200px+)**: Grid de 4-5 columnas, side menu completo
- **Tablet (768px-1199px)**: Grid de 2-3 columnas, navegación adaptada
- **Mobile (320px-767px)**: Grid de 1 columna, menú hamburguesa

## 🔧 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── search-bar/
│   │   │   ├── search-bar.component.html      # Barra de búsqueda
│   │   │   ├── search-bar.component.scss      # Estilos de búsqueda
│   │   │   └── search-bar.component.ts        # Lógica de búsqueda
│   │   └── trailer-modal/
│   │       ├── trailer-modal.component.html   # Modal de tráileres
│   │       ├── trailer-modal.component.scss   # Estilos del modal
│   │       └── trailer-modal.component.ts     # Lógica del modal
│   ├── pages/
│   │   ├── home/
│   │   │   ├── home.component.html            # Página principal
│   │   │   ├── home.component.scss            # Estilos principales
│   │   │   └── home.component.ts              # Lógica principal
│   │   ├── movie-detail/
│   │   │   ├── movie-detail.component.html    # Detalle de película
│   │   │   ├── movie-detail.component.scss    # Estilos de detalle
│   │   │   └── movie-detail.component.ts      # Lógica de detalle
│   │   ├── cast-detail/
│   │   │   ├── cast-detail.component.html     # Detalle de actor
│   │   │   ├── cast-detail.component.scss     # Estilos de actor
│   │   │   └── cast-detail.component.ts       # Lógica de actor
│   │   ├── genre/
│   │   │   ├── genre.component.html           # Página de género
│   │   │   ├── genre.component.scss           # Estilos de género
│   │   │   └── genre.component.ts             # Lógica de género
│   │   ├── login/
│   │   │   ├── login.component.html           # Página de login
│   │   │   ├── login.component.scss           # Estilos de login
│   │   │   ├── login.component.ts             # Lógica de login
│   │   │   └── login-background.component.ts  # Animación de fondo
│   │   └── register/
│   │       ├── register.component.html        # Página de registro
│   │       ├── register.component.scss        # Estilos de registro
│   │       ├── register.component.ts          # Lógica de registro
│   │       └── register-background.component.ts # Animación de fondo
│   ├── services/
│   │   ├── tmdb.service.ts                    # Servicio API TMDB
│   │   ├── supabase.service.ts                # Servicio Supabase
│   │   ├── supabase.client.ts                 # Cliente Supabase
│   │   └── theme.service.ts                   # Servicio de temas
│   ├── pipes/
│   │   └── safe.pipe.ts                       # Pipe para URLs seguras
│   ├── app.component.html                     # Template principal
│   ├── app.component.scss                     # Estilos globales
│   ├── app.component.ts                       # Componente principal
│   ├── app.config.ts                          # Configuración de la app
│   └── app.routes.ts                          # Configuración de rutas
├── environments/
│   └── environment.ts                         # Variables de entorno
├── assets/
│   └── img/                                   # Imágenes estáticas
│       ├── filmnest-text-logo.png            # Logo de la aplicación
│       ├── poster-not-found.png              # Imagen por defecto
│       └── cast-not-found.png                # Imagen de actor por defecto
└── styles.scss                                # Estilos globales
```

## 📋 API Endpoints Utilizados

### Películas
- `GET /movie/popular` - Películas populares
- `GET /search/movie` - Búsqueda de películas
- `GET /movie/{id}` - Detalles de película específica
- `GET /movie/{id}/credits` - Créditos de película
- `GET /movie/{id}/images` - Imágenes de película
- `GET /movie/{id}/videos` - Videos y tráileres
- `GET /movie/{id}/recommendations` - Películas recomendadas

### Géneros
- `GET /genre/movie/list` - Lista de géneros disponibles
- `GET /discover/movie` - Películas por género

### Personas
- `GET /person/{id}` - Detalles de persona/actor
- `GET /person/{id}/movie_credits` - Créditos cinematográficos

## 🚀 Despliegue

Para desplegar la aplicación:

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.

## 🗺️ Roadmap - Funcionalidades Futuras

### 👤 **Perfiles de Usuario**
- **Perfil Personalizado**: Información de usuario, avatar y preferencias
- **Historial de Actividad**: Películas vistas, búsquedas recientes
- **Estadísticas Personales**: Géneros favoritos, décadas preferidas
- **Configuración Avanzada**: Notificaciones, privacidad y preferencias

### ❤️ **Gestión de Películas Favoritas**
- **Lista de Favoritos**: Marcar/desmarcar películas como favoritas
- **Filtros Avanzados**: Ordenar por fecha, género, calificación
- **Exportación**: Compartir lista de favoritos
- **Sincronización**: Favoritos disponibles en todos los dispositivos

### 📋 **Gestión de Listas Personalizadas**
- **Listas Temáticas**: "Películas para ver en pareja", "Clásicos del cine"
- **Organización**: Categorizar y etiquetar listas
- **Descripción**: Añadir notas y comentarios a cada lista
- **Ordenamiento**: Arrastrar y soltar para reorganizar

### 👥 **Listas Colaborativas**
- **Listas Compartidas**: Crear listas con amigos y familia
- **Permisos**: Control de quién puede editar cada lista
- **Comentarios**: Sistema de comentarios en listas
- **Notificaciones**: Alertas cuando alguien añade contenido

### 📺 **Soporte para Series de TV**
- **Catálogo de Series**: Explorar series populares y nuevas
- **Detalles de Episodios**: Información por temporada y episodio
- **Estado de Visualización**: Marcar episodios vistos/pendientes
- **Calendario de Emisiones**: Próximos episodios y temporadas

### 🎯 **Funcionalidades Extra Propuestas**

#### 🎨 **Sistema de Calificaciones Personalizadas**
- **Calificaciones Propias**: Sistema de 1-5 estrellas personal
- **Reseñas**: Escribir opiniones y reseñas
- **Análisis de Gustos**: IA que sugiere películas basadas en calificaciones
- **Comparación**: Comparar gustos con otros usuarios

#### 🎬 **Sistema de Watchlist Inteligente**
- **Cola de Reproducción**: Lista de películas para ver próximamente
- **Prioridades**: Marcar películas como alta/media/baja prioridad
- **Recordatorios**: Notificaciones para películas en watchlist
- **Sugerencias Automáticas**: IA que sugiere qué ver basado en preferencias

#### 🌟 **Sistema de Logros y Gamificación**
- **Insignias**: Desbloquear logros por ver diferentes géneros
- **Retos Mensuales**: "Ver 5 películas de los 80s"
- **Estadísticas Avanzadas**: Gráficos de actividad y preferencias
- **Ranking de Usuarios**: Comparar actividad con otros usuarios

#### 📊 **Análisis y Estadísticas Avanzadas**
- **Dashboard Personal**: Gráficos de películas vistas por mes/año
- **Análisis de Géneros**: Distribución de géneros favoritos
- **Tendencias**: Evolución de gustos a lo largo del tiempo
- **Exportación de Datos**: Descargar estadísticas personales

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [TMDB](https://www.themoviedb.org/) por proporcionar la API gratuita
- [Angular Material](https://material.angular.io/) por los componentes de UI
- [Angular](https://angular.io/) por el framework
- [Supabase](https://supabase.com/) por el backend as a service

---

¡Disfruta explorando FilmNest! 🎬✨
