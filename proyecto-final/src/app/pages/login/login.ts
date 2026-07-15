import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBackground } from '../../components/page-background/page-background';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, PageBackground, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  isLogin = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);
  focusedField = signal<string | null>(null);

  loginData = {
    correo: '',
    contrasena: ''
  };

  registerData = {
    nombre: '',
    correo: '',
    contrasena: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // If user is already logged in, redirect to home
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  toggleView() {
    this.isLogin.update(val => !val);
    this.error.set(null);
  }

  setFocused(fieldName: string | null) {
    this.focusedField.set(fieldName);
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);

    if (this.isLogin()) {
      // Login flow
      this.auth.login(this.loginData.correo, this.loginData.contrasena).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
        }
      });
    } else {
      // Registration flow
      this.auth.register(this.registerData.nombre, this.registerData.correo, this.registerData.contrasena).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message || 'Error al registrar usuario.');
        }
      });
    }
  }
}
