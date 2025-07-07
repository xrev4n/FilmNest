import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

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
export class AppComponent implements OnInit {
  /** Título de la aplicación */
  title = 'FilmNest';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // El servicio ya se inicializa automáticamente en su constructor
    // pero podemos asegurar que el tema se aplique correctamente
  }
}
