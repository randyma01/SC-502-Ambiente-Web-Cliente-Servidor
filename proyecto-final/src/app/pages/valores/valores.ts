import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageBackground } from '../../components/page-background/page-background';
import { ApiService } from '../../services/api.service';

interface ValueItem {
  name: string;
  desc: string;
  icon: string;
  color: string;
  tint: string;
  hoverClass: string;
}

interface PolicyItem {
  name: string;
  desc: string;
  url: string;
  icon: string;
  color: string;
  hoverClass: string;
  tint: string;
}

@Component({
  selector: 'app-valores',
  standalone: true,
  imports: [CommonModule, RouterLink, PageBackground],
  templateUrl: './valores.html',
  styleUrl: './valores.scss'
})
export class Valores implements OnInit, AfterViewInit {
  ready = signal(false);

  // Fade-in visibility signals for scroll reveal
  gridVisible = signal(false);
  policiesVisible = signal(false);
  ctaVisible = signal(false);

  @ViewChild('gridSection') gridSection!: ElementRef;
  @ViewChild('policiesSection') policiesSection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;

  private api = inject(ApiService);

  values: ValueItem[] = [
    {
      name: 'Integridad',
      desc: 'En MGN somos ejemplo de los más altos estándares éticos, con la honestidad, la justicia y la dignidad en primer lugar en cada acción que tomamos, en todo lugar y momento, y con todo el mundo.',
      icon: 'bi-hand-thumbs-up-fill',
      color: 'var(--green)',
      tint: '#F0F9E8',
      hoverClass: 'hover-card-tint-green'
    },
    {
      name: 'Valor',
      desc: 'En MGN, brindar resultados exitosos y una experiencia superior para todos y en todo momento es de muy alta importancia, tanto para nuestros socios comerciales, para nosotros mismos y para nuestros equipos.',
      icon: 'bi-gem',
      color: 'var(--blue)',
      tint: '#E8F4FF',
      hoverClass: 'hover-card-tint-blue'
    },
    {
      name: 'Conocimiento',
      desc: 'La creatividad, la agilidad y la capacidad refuerzan el espíritu emprendedor y competitivo. No existe un sustituto para las acciones de futuro, ni para el deseo de lograr más, que estar en constante actualización de conocimientos.',
      icon: 'bi-book-half',
      color: 'var(--purple)',
      tint: '#EDE8FF',
      hoverClass: 'hover-card-tint-purple'
    },
    {
      name: 'Talento',
      desc: 'Nuestro equipo y sus diversos talentos definen a MGN. Estamos comprometidos con el aprendizaje, la colaboración, la transparencia y la innovación. Atraer, inspirar, retener y celebrar a nuestras mejores personas es la base de éxito.',
      icon: 'bi-people-fill',
      color: 'var(--blue)',
      tint: '#E8F4FF',
      hoverClass: 'hover-card-tint-blue'
    },
    {
      name: 'Innovación',
      desc: 'Adoptar cambios y tomar decisiones difíciles brindar mejores resultados a nuestros clientes, proveedores y colegas asociados. No tememos experimentar ni hacer lo que sabemos que es correcto.',
      icon: 'bi-lightbulb-fill',
      color: 'var(--purple)',
      tint: '#EDE8FF',
      hoverClass: 'hover-card-tint-purple'
    },
    {
      name: 'Responsabilidad',
      desc: 'Somos responsables de nuestras acciones individuales y de equipo cumpliendo con nuestros compromisos financieros y de nuestros clientes y reconociendo nuestras responsabilidades sociales, comunitarias y ambientales.',
      icon: 'bi-shield-check',
      color: 'var(--green)',
      tint: '#F0F9E8',
      hoverClass: 'hover-card-tint-green'
    }
  ];

  policies: PolicyItem[] = [
    {
      name: 'Protección Ambiental',
      desc: 'Nuestro compromiso con prácticas sustentables y la reducción de nuestra huella ecológica en todas las operaciones.',
      url: 'https://cdn.sanity.io/files/bl000y1v/production/8db474b69ea1489568d66ed40550b8958d326798.pdf',
      icon: 'bi-tree-fill',
      color: 'var(--green)',
      hoverClass: 'hover-card-tint-green',
      tint: '#F0F9E8'
    },
    {
      name: 'Anticorrupción',
      desc: 'Políticas de cero tolerancia al soborno y comportamientos contrarios a la ética comercial e integridad profesional.',
      url: 'https://cdn.sanity.io/files/bl000y1v/production/ba8ee57cd706ee7d15b091e7b3818656dc4db047.pdf',
      icon: 'bi-shield-lock-fill',
      color: 'var(--blue)',
      hoverClass: 'hover-card-tint-blue',
      tint: '#E8F4FF'
    },
    {
      name: 'Prácticas Laborales',
      desc: 'Lineamientos para garantizar un ambiente de trabajo seguro, justo, inclusivo y respetuoso para todo nuestro talento.',
      url: 'https://cdn.sanity.io/files/bl000y1v/production/ccf499b4c8e6f0af27c356ce1655094e05bfa9cf.pdf',
      icon: 'bi-briefcase-fill',
      color: 'var(--purple)',
      hoverClass: 'hover-card-tint-purple',
      tint: '#EDE8FF'
    }
  ];

  ngOnInit() {
    setTimeout(() => this.ready.set(true), 80);
  }

  ngAfterViewInit() {
    this.observeElement(this.gridSection, this.gridVisible);
    this.observeElement(this.policiesSection, this.policiesVisible);
    this.observeElement(this.ctaSection, this.ctaVisible);
  }

  logDownload(policyName: string) {
    this.api.logDescargaPolitica(policyName).subscribe({
      next: () => console.log(`Descarga de política '${policyName}' registrada en DB.`),
      error: err => console.error('Error al registrar descarga de política:', err)
    });
  }

  private observeElement(element: ElementRef, visibilitySignal: any) {
    if (!element) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        visibilitySignal.set(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(element.nativeElement);
  }
}
