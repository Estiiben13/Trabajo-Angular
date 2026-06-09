import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../services/post/post.service';
import { PostFormComponent } from './post-form.components';
import { CreatePost } from '../models/post.model';

@Component({
  selector: 'app-post-edit',
  standalone: true,
  imports: [PostFormComponent],
  template: `
    <h1>✏ Editar Post #{{ id() }}</h1>

    @if (service.loading()) {
      <p>⏳ Cargando datos...</p>
    }

    @if (service.selected(); as post) {
      <app-post-form
        [initialData]="post"
        (formSubmit)="onUpdate($event)"
        (onCancel)="router.navigate(['/posts', id()])"
      />
    }
  `
})
export class PostEditComponent implements OnInit {
  id = input.required<string>();
  service = inject(PostService);
  router = inject(Router);

  ngOnInit(): void {
    this.service.getById(Number(this.id()));
  }

  onUpdate(data: CreatePost): void {
    const postId = Number(this.id());
    this.service.update(postId, data).subscribe(() =>
      this.router.navigate(['/posts', postId])
    );
  }
}