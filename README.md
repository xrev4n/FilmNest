# 🎬 FilmNest

Una plataforma web moderna para gestionar watchlists y calificaciones de películas, construida con Angular e integrada con la API de TMDB.

## ✨ Características

- 🎯 **Diseño Minimalista**: Interfaz limpia y moderna
- 📱 **Totalmente Responsivo**: Optimizado para móviles y escritorio
- 🔍 **Búsqueda en Tiempo Real**: Busca películas por título
- 📄 **Paginación**: Navega fácilmente entre páginas de resultados
- 🎭 **Detalles Completos**: Información detallada de cada película
- ⭐ **Calificaciones**: Visualización de puntuaciones de usuarios
- 🎨 **Material Design**: Componentes de Angular Material
- 📝 **Código Documentado**: Comentarios descriptivos en todo el código
- 🗂️ **Estructura Organizada**: Archivos HTML, SCSS y TypeScript separados

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

3. **Configura la API Key de TMDB**
   
   Para usar la aplicación, necesitas obtener una API key gratuita de TMDB:
   
   - Ve a [TMDB](https://www.themoviedb.org/settings/api)
   - Crea una cuenta gratuita
   - Solicita una API key
   - Copia tu API key

   Luego crea el archivo `src/environments/environment.ts` y pega el siguiente codigo y reemplaza el campo tmdbApiKey:
   ```typescript
   export const environment = {
  production: false,
  tmdbApiKey: 'tu_api_key_aqui' // Reemplaza con tu API key real
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p'};,
   ```

4. **Ejecuta la aplicación**
   ```bash
   npm start
   ```

5. **Abre tu navegador**
   
   La aplicación estará disponible en `http://localhost:4200`

## 🛠️ Tecnologías Utilizadas

- **Angular 19**: Framework principal
- **Angular Material**: Componentes de UI
- **TMDB API**: Datos de películas
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos avanzados
- **RxJS**: Programación reactiva

## 📱 Funcionalidades

### Página Principal
- Lista de películas populares
- Barra de búsqueda funcional
- Paginación automática
- Diseño de tarjetas con hover effects

### Detalle de Película
- Información completa de la película
- Imagen de fondo y póster
- Metadatos (año, duración, calificación)
- Géneros y sinopsis
- Información financiera (presupuesto y recaudación)

### Búsqueda
- Búsqueda en tiempo real
- Resultados paginados
- Manejo de errores
- Estados de carga

## 🎨 Diseño

El diseño sigue los principios de Material Design con:
- Paleta de colores consistente
- Tipografía clara y legible
- Espaciado uniforme
- Animaciones sutiles
- Iconografía coherente

### Responsive Design
- **Desktop**: Grid de 4-5 columnas
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: Grid de 1 columna

## 🔧 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── search-bar/
│   │       ├── search-bar.component.html      # Template HTML
│   │       ├── search-bar.component.scss      # Estilos SCSS
│   │       └── search-bar.component.ts        # Lógica TypeScript
│   ├── pages/
│   │   ├── home/
│   │   │   ├── home.component.html            # Template HTML
│   │   │   ├── home.component.scss            # Estilos SCSS
│   │   │   └── home.component.ts              # Lógica TypeScript
│   │   └── movie-detail/
│   │       ├── movie-detail.component.html    # Template HTML
│   │       ├── movie-detail.component.scss    # Estilos SCSS
│   │       └── movie-detail.component.ts      # Lógica TypeScript
│   ├── services/
│   │   └── tmdb.service.ts                    # Servicio API con comentarios
│   ├── app.component.html                     # Template principal
│   ├── app.component.scss                     # Estilos globales
│   ├── app.component.ts                       # Componente principal
│   ├── app.config.ts                          # Configuración de la app
│   └── app.routes.ts                          # Configuración de rutas
├── environments/
│   └── environment.ts                         # Variables de entorno
├── assets/                                    # Recursos estáticos
└── styles.scss                                # Estilos globales
```

## 📋 API Endpoints Utilizados

- `GET /movie/popular` - Películas populares
- `GET /search/movie` - Búsqueda de películas
- `GET /movie/{id}` - Detalles de película específica

### Componentes
- **JSDoc**: Documentación de clases y métodos
- **Comentarios HTML**: Explicación de secciones del template
- **Comentarios SCSS**: Documentación de estilos y media queries

### Servicios
- **Interfaces**: Documentación de tipos de datos
- **Métodos**: Descripción de parámetros y valores de retorno
- **Propiedades**: Explicación de variables importantes

## 🚀 Despliegue

Para desplegar la aplicación:

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [TMDB](https://www.themoviedb.org/) por proporcionar la API gratuita
- [Angular Material](https://material.angular.io/) por los componentes de UI
- [Angular](https://angular.io/) por el framework

---

¡Disfruta explorando FilmNest! 🎬✨