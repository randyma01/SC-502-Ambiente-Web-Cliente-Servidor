import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface DBServiceItem {
  id: number;
  nombre: string;
  tagline: string;
  descripcion: string;
  color_css: string;
  tint_css: string;
}

export interface DBPartnerItem {
  id: number;
  nombre: string;
  tier: string;
  descripcion: string;
  highlight: string;
  nombre_categoria: string;
  categoria_tagline: string;
  color_css: string;
}

export interface DBTicketItem {
  id: number;
  tema: string;
  mensaje: string;
  estado: 'Abierto' | 'En Progreso' | 'Resuelto';
  fecha_creacion: string;
  servicio_nombre?: string;
  cliente_nombre?: string;
  cliente_correo?: string;
}

export interface DBActivityLog {
  id: number;
  accion: string;
  detalles: string;
  fecha_hora: string;
  usuario_nombre?: string;
  usuario_correo?: string;
  nombre_rol?: string;
}

export interface DBDownloadLog {
  id: number;
  politica_nombre: string;
  fecha_descarga: string;
  usuario_nombre?: string;
  usuario_correo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.token();
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });
  }

  // Solutions / Services
  getServicios(): Observable<DBServiceItem[]> {
    return this.http.get<DBServiceItem[]>(`${this.baseUrl}/servicios`);
  }

  // Partners
  getPartners(): Observable<DBPartnerItem[]> {
    return this.http.get<DBPartnerItem[]>(`${this.baseUrl}/partners`);
  }

  // Tickets (Transactional)
  registrarTicket(servicioId: number | null, tema: string, mensaje: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/tickets`, { servicioId, tema, mensaje }, { headers });
  }

  getTickets(): Observable<DBTicketItem[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DBTicketItem[]>(`${this.baseUrl}/tickets`, { headers });
  }

  updateTicketEstado(ticketId: number, estado: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.baseUrl}/tickets/${ticketId}/estado`, { estado }, { headers });
  }

  // Log downloads (Transactional / Audit log)
  logDescargaPolitica(politicaNombre: string): Observable<any> {
    const token = this.auth.token();
    return this.http.post<any>(`${this.baseUrl}/logs/descarga`, { token, politicaNombre });
  }

  // Audit Logs (Admins only)
  getActivityLogs(): Observable<DBActivityLog[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DBActivityLog[]>(`${this.baseUrl}/logs/actividades`, { headers });
  }

  // Download Logs (Support & Admins)
  getDescargasLogs(): Observable<DBDownloadLog[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<DBDownloadLog[]>(`${this.baseUrl}/logs/descargas`, { headers });
  }
}
