import { Component, input, output, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Post, CreatePost } from '../models/post.model';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      class="post-form"
    >
      <div class="field">
        <label for="title">📌 Título</label>
        <input
          id="title"
          formControlName="title"
          placeholder="Título del post"
        />
        @if (form.get('title')?.touched && form.get('title')?.invalid) {
          <span class="error">
            Título requerido (mín. 5 caracteres)
          </span>
        }
      </div>

      <div class="field">
        <label for="body">📝 Contenido</label>
        <textarea
          id="body"
          formControlName="body"
          rows="6"
          placeholder="Escribe el contenido..."
        ></textarea>
        @if (form.get('body')?.touched && form.get('body')?.invalid) {
          <span class="error">
            Contenido requerido (mín. 10 caracteres)
          </span>
        }
      </div>

      <div class="field">
        <label for="userId">👤 ID del Autor</label>
        <input
          id="userId"
          type="number"
          formControlName="userId"
          placeholder="1-10"
        />
      </div>

      <div class="actions">
        <button
          type="submit"
          [disabled]="form.invalid"
          class="btn-submit"
        >
          {{ initialData() ? '✅ Actualizar' : '➕ Crear' }}
        </button>
        <button
          type="button"
          class="btn-cancel"
          (click)="onCancel.emit()"
        >
          Cancelar
        </button>
      </div>
    </form>
  `,
  styles: [`
    .post-form {
      max-width: 640px;
    }

    .field {
      margin-bottom: 1.25rem;
    }

    .field label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.4rem;
      color: #283593;
    }

    .field input,
    .field textarea {
      width: 100%;
      padding: 0.6rem 0.8rem;
      border: 2px solid #C5CAE9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .field input:focus,
    .field textarea:focus {
      border-color: #283593;
      outline: none;
    }

    .error {
      color: #C62828;
      font-size: 0.85rem;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    .btn-submit {
      background: #283593;
      color: white;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-submit:disabled {
      background: #9FA8DA;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #ECEFF1;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
    }
  `]
})
export class PostFormComponent implements OnInit {
  initialData = input<Post | null>(null);
  formSubmit = output<CreatePost>();
  onCancel = output<void>();

  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    body: ['', [Validators.required, Validators.minLength(10)]],
    userId: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
  });

  ngOnInit(): void {
    const data = this.initialData();
    if (data) {
      this.form.patchValue({
        title: data.title,
        body: data.body,
        userId: data.userId,
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    }
  }
}