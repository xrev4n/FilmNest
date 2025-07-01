import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente principal de la aplicación
 * Contiene el router outlet para la navegación entre páginas
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonToggleModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /** Título de la aplicación */
  title = 'Catálogo de Películas';

  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
