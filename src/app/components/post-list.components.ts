import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { PostService } from '../services/post/post.service';
import { PostCardComponent } from './post-card.components';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [PostCardComponent, ReactiveFormsModule],
  template: `
    <section class="list-page">
      <div class="list-header">
        <h1>📚 Todos los Posts</h1>
        <p class="count">
          {{ service.filteredCount() }} de {{ service.postCount() }} posts
        </p>
      </div>

      <!-- Barra de búsqueda -->
      <div class="search-bar">
        <input
          [formControl]="searchCtrl"
          placeholder="🔍 Buscar posts..."
          class="search-input"
        />
      </div>

      <!-- Estado: Cargando -->
      @if (service.loading()) {
        <div class="loading">⏳ Cargando posts...</div>
      }

      <!-- Estado: Error -->
      @if (service.error(); as err) {
        <div class="error-box">
          <span>❌ {{ err }}</span>
          <button (click)="service.getAll()">Reintentar</button>
        </div>
      }

      <!-- Lista de posts -->
      @for (post of service.filteredPosts(); track post.id) {
        <app-post-card
          [post]="post"
          (onDelete)="deletePost($event)"
        />
      } @empty {
        <p class="empty">No se encontraron posts.</p>
      }
    </section>
  `,
  styles: [`
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .count {
      color: #78909C;
      font-size: 0.9rem;
    }

    .search-bar {
      margin: 1rem 0;
    }

    .search-input {
      width: 100%;
      padding: 0.7rem 1rem;
      border: 2px solid #C5CAE9;
      border-radius: 10px;
      font-size: 1rem;
    }

    .search-input:focus {
      border-color: #283593;
      outline: none;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #1565C0;
      font-size: 1.1rem;
    }

    .error-box {
      background: #FFEBEE;
      padding: 1rem;
      border-radius: 8px;
      color: #C62828;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .empty {
      text-align: center;
      color: #9E9E9E;
      padding: 3rem;
    }
  `]
})
export class PostListComponent implements OnInit {
  service = inject(PostService);
  searchCtrl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    this.service.getAll();
    this.searchCtrl.valueChanges.subscribe(term =>
      this.service.setSearch(term)
    );
  }

  deletePost(id: number): void {
    if (confirm('¿Eliminar este post?')) {
      this.service.delete(id).subscribe();
    }
  }
}