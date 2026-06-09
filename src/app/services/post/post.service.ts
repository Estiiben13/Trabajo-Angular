import {
    Injectable, inject, signal, computed, effect
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
    Observable, catchError, of, tap, map, EMPTY
} from 'rxjs';
import {
    Post, CreatePost, UpdatePost, Comment
} from '../../models/post.model';
import { environment } from
    '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private http = inject(HttpClient);
    private apiUrl = '${environment.apiUrl}/posts';

    private _postsSignal = signal<Post[]>([]);

    private _selectedPostId = signal<number | null>(null);

    private _loading = signal<boolean>(false);

    private _error = signal<string | null>(null);

    private _searchTerm = signal<string>('');

    readonly posts = this._postsSignal.asReadonly();
    readonly selected = this._selectedPostId.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly searchTerm = this._searchTerm.asReadonly();

    readonly postCount = computed(() => this._postsSignal().length);

    readonly filteredPosts = computed(() => {
        const term = this._searchTerm().toLowerCase();
        const all = this._postsSignal();
        if (!term) return all;
        return all.filter(post =>
            post.title.toLowerCase().includes(term) ||
            post.body.toLowerCase().includes(term)
        );
    });

    readonly filteredCount = computed(
        () => this.filteredPosts().length
    );

    readonly postsByUser = computed(() => {
        const groups = new Map<number, Post[]>();
        this._postsSignal().forEach(post => {
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
            console.log(
                `[PostService] ${count} posts cargados`
            );
        }
    });

    getAll(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<Post[]>(this.apiUrl).pipe(
            tap(posts => {
                this._postsSignal.set(posts);
                this._loading.set(false);
            }),
            catchError(err => {
                this._error.set(
                    err.message ?? 'Error al cargar posts'
                );
                this._loading.set(false);
                return EMPTY;
            })
        ).subscribe();
    }

    getById(id: number): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<Post>(
            `${this.apiUrl} / ${id}`
        ).pipe(
            tap(post => {
                this._selectedPostId.set(post.id);
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
this ._error.set(null);

return this.http.post<Post>(
this.apiUrl, data
).pipe(
tap(newPost =>{
    const localPost: Post = {
...newPost,
id: this ._postsSignal().length + 1,
};
this._postsSignal.update(
list => [localPost, ... list]
D;
this ._loading.set(false);

catchError(err => {
this ._ error.set('Error al crear el post');
this. loading.set(false);
return EMPTY;