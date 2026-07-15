import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBackground } from '../../components/page-background/page-background';
import { AuthService } from '../../services/auth.service';
import { ApiService, DBTicketItem, DBActivityLog, DBDownloadLog } from '../../services/api.service';

interface ChannelItem {
  icon: string;
  label: string;
  value: string;
  hint: string;
  href: string;
  color: string;
  borderHover: string;
  shadowHover: string;
  tint: string;
}

interface ReasonItem {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface HourItem {
  day: string;
  hours: string;
}

interface LocationItem {
  label: string;
  value: string;
  sub: string;
  color: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, RouterLink, PageBackground, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss'
})
export class Contacto implements OnInit, AfterViewInit {
  ready = signal(false);

  // Scroll reveal visibility flags
  reasonsVisible = signal(false);
  formVisible = signal(false);
  stripVisible = signal(false);

  @ViewChild('mainSection') mainSection!: ElementRef;
  @ViewChild('locationSection') locationSection!: ElementRef;

  // Services
  auth = inject(AuthService);
  private api = inject(ApiService);

  // Database Loaded Data
  tickets = signal<DBTicketItem[]>([]);
  activityLogs = signal<DBActivityLog[]>([]);
  downloadLogs = signal<DBDownloadLog[]>([]);

  channels: ChannelItem[] = [
    { icon: 'bi-telephone-fill', label: 'Llamada directa', value: '+506 2220-7900', hint: 'Lun–Vie, 8:00–18:00', href: 'tel:+50622207900', color: 'var(--green)', borderHover: 'rgba(106, 176, 35, 0.35)', shadowHover: '0 8px 28px rgba(106, 176, 35, 0.14)', tint: '#F0F9E8' },
    { icon: 'bi-envelope-fill', label: 'Correo comercial', value: 'comercial@mgn.tech', hint: 'Respuesta en < 4 horas hábiles', href: 'mailto:comercial@mgn.tech', color: 'var(--blue)', borderHover: 'rgba(0, 130, 193, 0.35)', shadowHover: '0 8px 28px rgba(0, 130, 193, 0.14)', tint: '#E8F4FF' },
    { icon: 'bi-headset', label: 'Soporte técnico', value: 'soporte@mgn.tech', hint: '24 / 7 para contratos activos', href: 'mailto:soporte@mgn.tech', color: 'var(--purple)', borderHover: 'rgba(43, 28, 90, 0.35)', shadowHover: '0 8px 28px rgba(43, 28, 90, 0.14)', tint: '#EDE8FF' },
    { icon: 'bi-geo-alt-fill', label: 'Oficina principal', value: 'Cartago, Costa Rica', hint: 'Con previa coordinación', href: 'https://maps.google.com/?q=Cartago,Costa+Rica', color: 'var(--green)', borderHover: 'rgba(106, 176, 35, 0.35)', shadowHover: '0 8px 28px rgba(106, 176, 35, 0.14)', tint: '#F0F9E8' }
  ];

  topics: string[] = [
    'Ciberseguridad', 'Zero Trust / SASE', 'Cloud & Azure', 'Redes empresariales',
    'Infraestructura', 'DevSecOps', 'Soporte técnico', 'Otro'
  ];

  reasons: ReasonItem[] = [
    { icon: 'bi-chat-left-text-fill', title: 'Asesoría técnica sin costo', desc: 'Una llamada de 30 minutos con un especialista certificado para entender su desafío y orientar la solución más adecuada.', color: 'var(--green)' },
    { icon: 'bi-people-fill', title: 'Equipo local disponible', desc: 'No hay intermediarios. Su cuenta es atendida por ingenieros costarricenses que conocen su entorno.', color: 'var(--blue)' },
    { icon: 'bi-clock-fill', title: 'Respuesta garantizada', desc: 'Comercial responde en menos de 4 horas hábiles. Para clientes con contrato, atendemos 24 / 7.', color: 'var(--purple)' }
  ];

  hours: HourItem[] = [
    { day: 'Lunes a Viernes', hours: '8:00 am – 6:00 pm' },
    { day: 'Sábados', hours: '8:00 am – 12:00 pm' },
    { day: 'Soporte 24/7', hours: 'Clientes con contrato activo' }
  ];

  stripItems: LocationItem[] = [
    { label: 'Sede central', value: 'Cartago, Costa Rica', sub: 'Oficina con previa cita', color: 'var(--green)' },
    { label: 'Cobertura', value: 'Valle Central', sub: 'San José · Cartago · Heredia · Alajuela', color: 'var(--blue)' },
    { label: 'Registro legal', value: 'MartinezGroup Net S.A.', sub: 'Empresa costarricense 100%', color: 'var(--purple)' }
  ];

  // Form State
  form = {
    name: '',
    company: '',
    email: '',
    phone: '',
    topic: '',
    message: ''
  };

  focusedField = signal<string | null>(null);
  sending = signal(false);
  sent = signal(false);
  submitError = signal<string | null>(null);

  ngOnInit() {
    setTimeout(() => this.ready.set(true), 80);
    this.loadData();
  }

  ngAfterViewInit() {
    this.observeElement(this.mainSection, this.reasonsVisible);
    this.observeElement(this.mainSection, this.formVisible);
    this.observeElement(this.locationSection, this.stripVisible);
  }

  private observeElement(element: ElementRef, visibilitySignal: any) {
    if (!element) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        visibilitySignal.set(true);
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(element.nativeElement);
  }

  setFocused(fieldName: string | null) {
    this.focusedField.set(fieldName);
  }

  selectTopic(topic: string) {
    this.form.topic = topic;
  }

  loadData() {
    if (!this.auth.isLoggedIn()) return;

    const role = this.auth.userRole();

    // All roles can load tickets (filtered by server)
    this.api.getTickets().subscribe({
      next: data => this.tickets.set(data),
      error: err => console.error('Error al cargar tickets:', err)
    });

    if (role === 'Soporte' || role === 'Administrador') {
      this.api.getDescargasLogs().subscribe({
        next: data => this.downloadLogs.set(data),
        error: err => console.error('Error al cargar descargas:', err)
      });
    }

    if (role === 'Administrador') {
      this.api.getActivityLogs().subscribe({
        next: data => this.activityLogs.set(data),
        error: err => console.error('Error al cargar bitácora:', err)
      });
    }

    // Pre-populate user details in the form
    const user = this.auth.currentUser();
    if (user) {
      this.form.name = user.nombre;
      this.form.email = user.correo;
    }
  }

  onSubmit() {
    if (!this.auth.isLoggedIn()) {
      this.submitError.set('Debe iniciar sesión para registrar un ticket.');
      return;
    }

    if (!this.form.topic || !this.form.message) {
      return;
    }

    this.sending.set(true);
    this.submitError.set(null);

    this.api.registrarTicket(null, this.form.topic, this.form.message).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.loadData(); // Reload list
      },
      error: (err) => {
        this.sending.set(false);
        this.submitError.set(err.error?.message || 'Error al enviar ticket a la base de datos.');
      }
    });
  }

  updateTicketStatus(ticketId: number, status: string) {
    this.api.updateTicketEstado(ticketId, status).subscribe({
      next: () => {
        this.loadData(); // Refresh list and logs
      },
      error: err => alert(err.error?.message || 'Error al actualizar ticket.')
    });
  }

  resetForm() {
    this.sent.set(false);
    this.submitError.set(null);
    const user = this.auth.currentUser();
    this.form = {
      name: user?.nombre || '',
      company: '',
      email: user?.correo || '',
      phone: '',
      topic: '',
      message: ''
    };
  }
}
