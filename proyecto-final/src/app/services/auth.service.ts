import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: 'Administrador' | 'Soporte' | 'Cliente';
}

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  
  // State signals
  currentUser = signal<User | null>(null);
  token = signal<string | null>(null);

  isLoggedIn = computed(() => this.currentUser() !== null);
  userRole = computed(() => this.currentUser()?.rol || null);

  constructor(private http: HttpClient) {
    // Rehydrate session from localStorage
    const savedToken = localStorage.getItem('mgn_token');
    const savedUser = localStorage.getItem('mgn_user');
    
    if (savedToken && savedUser) {
      try {
        this.token.set(savedToken);
        this.currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  login(correo: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { correo, contrasena }).pipe(
      tap(res => {
        this.saveSession(res.token, res.user);
      })
    );
  }

  register(nombre: string, correo: string, contrasena: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { nombre, correo, contrasena }).pipe(
      tap(res => {
        this.saveSession(res.token, res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('mgn_token');
    localStorage.removeItem('mgn_user');
    this.token.set(null);
    this.currentUser.set(null);
  }

  private saveSession(token: string, user: User) {
    localStorage.setItem('mgn_token', token);
    localStorage.setItem('mgn_user', JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }
}
