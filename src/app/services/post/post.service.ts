import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, EMPTY, tap } from 'rxjs';
import { Post, CreatePost, UpdatePost, Comment } from '../../models/post.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/posts`;

  private _posts = signal<Post[]>([]);
  private _selectedPost = signal<Post | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _searchTerm = signal<string>('');

  readonly posts = this._posts.asReadonly();
  readonly selected = this._selectedPost.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();

  readonly postCount = computed(() => this._posts().length);
  readonly filteredPosts = computed(() => {
    const term = this._searchTerm().toLowerCase();
    const all = this._posts();
    if (!term) return all;
    return all.filter(post =>
      post.title.toLowerCase().includes(term) ||
      post.body.toLowerCase().includes(term)
    );
  });
  readonly filteredCount = computed(() => this.filteredPosts().length);
  readonly postsByUser = computed(() => {
    const groups = new Map<number, Post[]>();
    this._posts().forEach(post => {
      const list = groups.get(post.userId) ?? [];
      list.push(post);
      groups.set(post.userId, list);
    });
    return groups;
  });

  private logEffect = effect(() => {
    const count = this.postCount();
    const err = this._error();
    if (err) {
      console.error('[PostService] Error:', err);
    } else {
      console.log(`[PostService] ${count} posts cargados`);
    }
  });

  getAll(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Post[]>(this.apiUrl).pipe(
      tap(posts => {
        this._posts.set(posts);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set(err.message ?? 'Error al cargar posts');
        this._loading.set(false);
        return EMPTY;
      })
    ).subscribe();
  }

  getById(id: number): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      tap(post => {
        this._selectedPost.set(post);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set(`Error al cargar post ${id}`);
        this._loading.set(false);
        return EMPTY;
      })
    ).subscribe();
  }

  create(data: CreatePost): Observable<Post> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.post<Post>(this.apiUrl, data).pipe(
      tap(newPost => {
        const localPost: Post = {
          ...newPost,
          id: this._posts().length + 1,
        };
        this._posts.update(list => [localPost, ...list]);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Error al crear el post');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  update(id: number, data: CreatePost): Observable<Post> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.put<Post>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updated => {
        this._posts.update(list =>
          list.map(p =>
            p.id === id ? { ...p, ...data } : p
          )
        );
        this._selectedPost.set({ ...updated, id });
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set(`Error al actualizar post ${id}`);
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  patch(id: number, data: UpdatePost): Observable<Post> {
    this._loading.set(true);

    return this.http.patch<Post>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updated => {
        this._posts.update(list =>
          list.map(p =>
            p.id === id ? { ...p, ...data } : p
          )
        );
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Error en PATCH');
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  delete(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._posts.update(list => list.filter(p => p.id !== id));
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set(`Error al eliminar post ${id}`);
        this._loading.set(false);
        return EMPTY;
      })
    );
  }

  setSearch(term: string): void {
    this._searchTerm.set(term);
  }

  clearSelected(): void {
    this._selectedPost.set(null);
  }

  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${postId}/comments`);
  }
}