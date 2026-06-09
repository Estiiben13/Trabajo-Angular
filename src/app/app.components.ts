import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="navbar">
      <a routerLink="/posts" class="logo">📝 PostManager</a>

      <nav>
        <a routerLink="/posts">Todos</a>
        <a routerLink="/posts/new">+ Nuevo</a>
      </nav>
    </header>

    <main class="container">
      <router-outlet />
    </main>

    <footer class="footer">
      <p>PostManager &copy; 2026 — Angular 21</p>
    </footer>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #283593;
      color: white;
    }

    .navbar a {
      color: white;
      text-decoration: none;
      margin-left: 1.5rem;
    }

    .logo {
      font-size: 1.4rem;
      font-weight: bold;
    }

    .container {
      max-width: 960px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .footer {
      text-align: center;
      padding: 1rem;
      color: #78909C;
      font-size: 0.85rem;
    }
  `]
})
export class AppComponent {}