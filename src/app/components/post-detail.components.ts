import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostService } from '../services/post/post.service';
import { Comment } from '../models/post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (service.loading()) {
      <p>⏳ Cargando...</p>
    }

    @if (service.selected(); as post) {
      <article class="detail">
        <div class="detail-header">
          <a routerLink="/posts">← Volver</a>
          <a [routerLink]="['/posts', post.id, 'edit']">✏ Editar</a>
        </div>

        <h1>{{ post.title }}</h1>
        <span class="meta">
          Post #{{ post.id }} • Autor: User {{ post.userId }}
        </span>
        <p class="body">{{ post.body }}</p>

        <h3>💬 Comentarios ({{ comments().length }})</h3>
        @for (c of comments(); track c.id) {
          <div class="comment">
            <strong>{{ c.name }}</strong>
            <small>{{ c.email }}</small>
            <p>{{ c.body }}</p>
          </div>
        } @empty {
          <p>Cargando comentarios...</p>
        }
      </article>
    }
  `,
  styles: [`
    .detail-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .detail-header a {
      color: #1565C0;
      text-decoration: none;
    }

    .meta {
      color: #78909C;
      font-size: 0.9rem;
    }

    .body {
      line-height: 1.8;
      margin: 1.5rem 0;
      color: #37474F;
    }

    .comment {
      border-left: 3px solid #C5CAE9;
      padding: 0.75rem 1rem;
      margin-bottom: 0.75rem;
      background: #F5F5F5;
      border-radius: 0 8px 8px 0;
    }

    .comment strong {
      color: #283593;
      display: block;
    }

    .comment small {
      color: #78909C;
    }
  `]
})
export class PostDetailComponent implements OnInit {
  id = input.required<string>();
  service = inject(PostService);
  comments = signal<Comment[]>([]);

  ngOnInit(): void {
    const postId = Number(this.id());
    this.service.getById(postId);
    this.service.getComments(postId).subscribe(c => this.comments.set(c));
  }
}