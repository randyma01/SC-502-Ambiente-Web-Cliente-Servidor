import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface ServiceItem {
  icon: string;
  name: string;
  desc: string;
  colorClass: string;
  hoverClass: string;
  iconColor: string;
}

interface StatItem {
  value: string;
  label: string;
  color: string;
}

interface PartnerItem {
  name: string;
  hoverClass: string;
  hoverColor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, AfterViewInit {
  ready = signal(false);
  
  // Fade-in visibility flags for scroll reveal
  statementVisible = signal(false);
  servicesVisible = signal(false);
  statsVisible = signal(false);
  partnersVisible = signal(false);
  ctaVisible = signal(false);

  @ViewChild('statementSection') statementSection!: ElementRef;
  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('statsSection') statsSection!: ElementRef;
  @ViewChild('partnersSection') partnersSection!: ElementRef;
  @ViewChild('ctaSection') ctaSection!: ElementRef;

  services: ServiceItem[] = [
    { icon: 'bi-shield-shaded', name: 'Ciberseguridad', desc: 'Protección avanzada contra amenazas actuales y emergentes en cada capa de su organización.', colorClass: 'text-success', hoverClass: 'hover-card-tint-green', iconColor: 'var(--green)' },
    { icon: 'bi-lock-fill', name: 'Zero Trust', desc: 'Arquitecturas que verifican cada identidad y cada acceso, sin excepciones.', colorClass: 'text-primary', hoverClass: 'hover-card-tint-blue', iconColor: 'var(--blue)' },
    { icon: 'bi-cloud-arrow-up-fill', name: 'Cloud', desc: 'Migración, gestión y optimización de entornos híbridos y multi-cloud.', colorClass: 'text-info', hoverClass: 'hover-card-tint-purple', iconColor: 'var(--purple)' },
    { icon: 'bi-diagram-3-fill', name: 'Redes', desc: 'Infraestructura de red robusta, segmentada y lista para escalar con su negocio.', colorClass: 'text-primary', hoverClass: 'hover-card-tint-blue', iconColor: 'var(--blue)' },
    { icon: 'bi-code-slash', name: 'DevSecOps', desc: 'Seguridad integrada desde el primer commit hasta producción.', colorClass: 'text-info', hoverClass: 'hover-card-tint-purple', iconColor: 'var(--purple)' },
    { icon: 'bi-server', name: 'Infraestructura', desc: 'Continuidad operativa garantizada con respaldo, HA y recuperación ante desastres.', colorClass: 'text-success', hoverClass: 'hover-card-tint-green', iconColor: 'var(--green)' }
  ];

  stats: StatItem[] = [
    { value: '20+', label: 'Años de experiencia', color: 'var(--green)' },
    { value: '500+', label: 'Proyectos ejecutados', color: 'var(--blue)' },
    { value: '100%', label: 'Costarricense', color: '#C4B5FD' }
  ];

  partners: PartnerItem[] = [
    { name: 'Cisco', hoverClass: 'hover-card-tint-blue', hoverColor: 'var(--blue)' },
    { name: 'Fortinet', hoverClass: 'hover-card-tint-green', hoverColor: 'var(--green)' },
    { name: 'Microsoft', hoverClass: 'hover-card-tint-blue', hoverColor: 'var(--blue)' },
    { name: 'AWS', hoverClass: 'hover-card-tint-purple', hoverColor: 'var(--purple)' },
    { name: 'Palo Alto Networks', hoverClass: 'hover-card-tint-blue', hoverColor: 'var(--blue)' },
    { name: 'VMware', hoverClass: 'hover-card-tint-green', hoverColor: 'var(--green)' },
    { name: 'Dell Technologies', hoverClass: 'hover-card-tint-blue', hoverColor: 'var(--blue)' },
    { name: 'HP Enterprise', hoverClass: 'hover-card-tint-purple', hoverColor: 'var(--purple)' }
  ];

  tickerItems: string[] = [
    'Ciberseguridad', '·', 'Zero Trust', '·', 'Cloud', '·',
    'DevSecOps', '·', 'Redes', '·', 'Infraestructura', '·',
    'Pentesting', '·', 'Ransomware Protection', '·', 'Firewall', '·'
  ];

  ngOnInit() {
    setTimeout(() => this.ready.set(true), 80);
  }

  ngAfterViewInit() {
    this.observeElement(this.statementSection, this.statementVisible);
    this.observeElement(this.servicesSection, this.servicesVisible);
    this.observeElement(this.statsSection, this.statsVisible);
    this.observeElement(this.partnersSection, this.partnersVisible);
    this.observeElement(this.ctaSection, this.ctaVisible);
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
