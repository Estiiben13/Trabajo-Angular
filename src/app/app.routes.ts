import { Routes } from '@angular/router';

/**
 * Rutas de la aplicación.
 *
 * Importante: aquí cargamos componentes con `loadComponent()`
 * usando los componentes reales que existen en `src/app/components`.
 *
 * En particular `/posts` debe cargar `PostListComponent` desde
 * `./components/post-list.components`, y no el placeholder de `pages`.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'posts',
    pathMatch: 'full',
  },
  {
    path: 'posts',
    // Cambiado para cargar el componente real del listado
    loadComponent: () =>
      import('./components/post-list.components').then(
        m => m.PostListComponent
      ),
    title: 'PostManager — Todos los Posts',
  },
  {
    path: 'posts/new',
    // Esta ruta aún usa el placeholder de pages
    loadComponent: () =>
      import('./pages/post-create').then(
        m => m.PostCreate
      ),
    title: 'Crear Nuevo Post',
  },
  {
    path: 'posts/:id',
    // Cambiado para cargar el componente real del detalle
    loadComponent: () =>
      import('./components/post-detail.components').then(
        m => m.PostDetailComponent
      ),
    title: 'Detalle del Post',
  },
  {
    path: 'posts/:id/edit',
    // Cambiado para cargar el componente real de edición
    loadComponent: () =>
      import('./components/post-edit.components').then(
        m => m.PostEditComponent
      ),
    title: 'Editar Post',
  },
  {
    path: '**',
    redirectTo: 'posts',
  },
];