import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Soluciones } from './pages/soluciones/soluciones';
import { Partners } from './pages/partners/partners';
import { Valores } from './pages/valores/valores';
import { Contacto } from './pages/contacto/contacto';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'soluciones', component: Soluciones },
  { path: 'partners', component: Partners },
  { path: 'valores', component: Valores },
  { path: 'contacto', component: Contacto },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];
