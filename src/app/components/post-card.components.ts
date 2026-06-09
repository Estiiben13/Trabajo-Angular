import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SlicePipe } from '@angular/common';
import { Post } from '../models/post.model';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [RouterLink, SlicePipe],
  template: `
    <article class="card">
      <div class="card-header">
        <span class="user-badge">User {{ post().userId }}</span>
        <span class="post-id">#{{ post().id }}</span>
      </div>

      <h3 class="card-title">
        <a [routerLink]="['/posts', post().id]">{{ post().title }}</a>
      </h3>

      <p class="card-body">{{ post().body | slice:0:120 }}...</p>

      <div class="card-actions">
        <a [routerLink]="['/posts', post().id]" class="btn btn-view">👁 Ver</a>
        <a [routerLink]="['/posts', post().id, 'edit']" class="btn btn-edit">✏ Editar</a>
        <button class="btn btn-delete" (click)="onDelete.emit(post().id)">🗑 Eliminar</button>
      </div>
    </article>
  `,
  styles: [`
    .card {
      border: 1px solid #E0E0E0;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
      transition: box-shadow 0.2s;
    }

    .card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .user-badge {
      background: #E8EAF6;
      color: #283593;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .post-id {
      color: #9E9E9E;
      font-size: 0.8rem;
    }

    .card-title a {
      color: #1565C0;
      text-decoration: none;
    }

    .card-body {
      color: #546E7A;
      line-height: 1.5;
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .btn {
      padding: 6px 14px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      text-decoration: none;
    }

    .btn-view {
      background: #E3F2FD;
      color: #1565C0;
    }

    .btn-edit {
      background: #FFF3E0;
      color: #E65100;
    }

    .btn-delete {
      background: #FFEBEE;
      color: #C62828;
    }
  `]
})
export class PostCardComponent {
  post = input.required<Post>();
  onDelete = output<number>();
}