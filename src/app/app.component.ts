import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente principal de la aplicación
 * Contiene el router outlet para la navegación entre páginas
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /** Título de la aplicación */
  title = 'FilmNest';
}
