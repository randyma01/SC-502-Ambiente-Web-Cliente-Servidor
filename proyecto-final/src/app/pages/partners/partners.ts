import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageBackground } from '../../components/page-background/page-background';

interface PartnerInfo {
  name: string;
  tier: string;
  desc: string;
  highlight: string;
}

interface CategoryItem {
  id: string;
  name: string;
  tagline: string;
  color: string;
  tint: string;
  description: string;
  partners: PartnerInfo[];
  hoverClass: string;
}

interface BenefitItem {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface StatItem {
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, RouterLink, PageBackground],
  templateUrl: './partners.html',
  styleUrl: './partners.scss'
})
export class Partners implements OnInit, AfterViewInit {
  ready = signal(false);

  // Fade-in visibility array for each category block, stats, benefits, and cta
  categoriesVisible = signal<boolean[]>([]);
  statsVisible = signal(false);
  benefitsVisible = signal(false);
  ctaVisible = signal(false);

  @ViewChildren('categoryBlock') categoryBlocks!: QueryList<ElementRef>;
  @ViewChildren('statsSection, benefitsSection, ctaSection') remainingSections!: QueryList<ElementRef>;

  categories: CategoryItem[] = [
    {
      id: '01', name: 'Seguridad', tagline: 'Cero tolerancia a las amenazas.', color: 'var(--green)', tint: '#F0F9E8',
      description: 'Las plataformas de seguridad más reconocidas del mundo, implementadas por especialistas que conocen el panorama de amenazas latinoamericano.',
      hoverClass: 'hover-card-tint-green',
      partners: [
        { name: 'Fortinet', tier: 'Gold Partner', desc: 'Líder global en seguridad de red. Firewalls de próxima generación, SD-WAN segura y plataforma Security Fabric.', highlight: 'Certified NSE 1–7' },
        { name: 'Palo Alto Networks', tier: 'Authorized Partner', desc: 'Plataforma de ciberseguridad más completa. NGFW, Prisma Cloud y Cortex XDR para detección en tiempo real.', highlight: 'PCNSE Certified' },
        { name: 'CrowdStrike', tier: 'Reseller Partner', desc: 'Protección de endpoints nativa en la nube. Falcon Platform con IA, inteligencia de amenazas y respuesta.', highlight: 'EDR / XDR' },
        { name: 'Splunk', tier: 'Registered Partner', desc: 'SIEM y observabilidad para correlación de eventos, detección de amenazas y cumplimiento normativo.', highlight: 'SIEM / SOAR' }
      ]
    },
    {
      id: '02', name: 'Cloud', tagline: 'Infraestructura sin límites.', color: 'var(--blue)', tint: '#E8F4FF',
      description: 'Alianzas directas con los tres grandes proveedores de nube pública, más las herramientas de automatización que las complementan.',
      hoverClass: 'hover-card-tint-blue',
      partners: [
        { name: 'Microsoft', tier: 'Gold Partner', desc: 'Azure, Microsoft 365 y Dynamics 365. Migraciones empresariales, entornos híbridos y seguridad Defender.', highlight: 'Azure Solutions Partner' },
        { name: 'Amazon Web Services', tier: 'Select Tier', desc: 'La nube más adoptada del mundo. Arquitecturas cloud-native, serverless, contenedores y servicios gestionados.', highlight: 'AWS Certified' },
        { name: 'Google Cloud', tier: 'Registered Partner', desc: 'BigQuery, Kubernetes Engine y Workspace. Analítica avanzada y ML sobre la infraestructura más rápida.', highlight: 'GCP Associate' },
        { name: 'HashiCorp', tier: 'Technology Partner', desc: 'Infraestructura como código para aprovisionar y gestionar recursos en cualquier proveedor cloud.', highlight: 'IaC / DevOps' }
      ]
    },
    {
      id: '03', name: 'Redes', tagline: 'Conectividad que no falla.', color: 'var(--purple)', tint: '#EDE8FF',
      description: 'Fabricantes líderes en switching, routing y conectividad inalámbrica empresarial, con certificaciones que respaldan cada implementación.',
      hoverClass: 'hover-card-tint-purple',
      partners: [
        { name: 'Cisco', tier: 'Premier Partner', desc: 'El estándar de la industria en redes empresariales. Switching, routing, colaboración y seguridad integrada.', highlight: 'CCNA / CCNP Certified' },
        { name: 'Aruba (HPE)', tier: 'Authorized Partner', desc: 'Redes inalámbricas y por cable de alto rendimiento. AIOps para operaciones autónomas y Zero Trust integrado.', highlight: 'ACMA / ACMP Certified' },
        { name: 'Juniper Networks', tier: 'Registered Partner', desc: 'Redes de centro de datos y WAN de alta disponibilidad. Automatización con Junos y AIOps Apstra.', highlight: 'JNCIA Certified' },
        { name: 'Extreme Networks', tier: 'Authorized Reseller', desc: 'Plataforma unificada de campus y data center. ExtremeCloud IQ para gestión centralizada.', highlight: 'Cloud Networking' }
      ]
    },
    {
      id: '04', name: 'Infraestructura', tagline: 'La base de todo lo demás.', color: 'var(--green)', tint: '#F0F9E8',
      description: 'Hardware empresarial y plataformas de virtualización que garantizan la continuidad operativa con los más altos estándares de disponibilidad.',
      hoverClass: 'hover-card-tint-green',
      partners: [
        { name: 'Dell Technologies', tier: 'Gold Partner', desc: 'Servidores PowerEdge, almacenamiento PowerStore y data protection. Infraestructura para cargas críticas.', highlight: 'Dell Certified' },
        { name: 'HP Enterprise', tier: 'Silver Partner', desc: 'Servidores ProLiant y almacenamiento Nimble. GreenLake para consumo de TI como servicio.', highlight: 'HPE Certified' },
        { name: 'VMware (Broadcom)', tier: 'Professional Partner', desc: 'Virtualización de servidores, redes y almacenamiento. vSphere, NSX y vSAN para centros de datos.', highlight: 'VCP / VCAP Certified' },
        { name: 'Veeam', tier: 'Silver Partner', desc: 'Respaldo, recuperación y replicación para entornos virtuales, físicos y cloud. RPO y RTO garantizados.', highlight: 'Veeam VMCE' }
      ]
    }
  ];

  benefits: BenefitItem[] = [
    { icon: 'bi-patch-check-fill', title: 'Certificaciones vigentes', desc: 'Nuestros ingenieros mantienen certificaciones activas de cada fabricante, no solo acreditaciones comerciales.', color: 'var(--green)' },
    { icon: 'bi-award-fill', title: 'Soporte de nivel 2 directo', desc: 'Como partner certificado, escalamos con los equipos técnicos del fabricante cuando usted lo necesita.', color: 'var(--blue)' },
    { icon: 'bi-graph-up-arrow', title: 'Mejores precios del mercado', desc: 'Nuestros acuerdos de partnership nos permiten ofrecer precios que no encontrará en otros canales.', color: 'var(--purple)' },
    { icon: 'bi-globe2', title: 'Cobertura local garantizada', desc: 'Soporte presencial en Cartago y San José. Sin dependencia de distribuidores ni tiempos de tránsito.', color: 'var(--green)' },
    { icon: 'bi-people-fill', title: 'Equipo técnico especializado', desc: 'Cada solución es implementada por ingenieros certificados en esa tecnología — no por generalistas.', color: 'var(--blue)' },
    { icon: 'bi-lightning-charge-fill', title: 'Disponibilidad 24 / 7', desc: 'Soporte post-venta continuo respaldado técnicamente por MGN sin horarios.', color: 'var(--purple)' }
  ];

  stats: StatItem[] = [
    { value: '15+', label: 'Partners tecnológicos activos', color: 'var(--green)' },
    { value: '40+', label: 'Certificaciones vigentes', color: 'var(--blue)' },
    { value: '20+', label: 'Años como canal autorizado', color: '#C4B5FD' }
  ];

  ngOnInit() {
    this.categoriesVisible.set(new Array(this.categories.length).fill(false));
    setTimeout(() => this.ready.set(true), 80);
  }

  ngAfterViewInit() {
    // Observe category blocks
    this.categoryBlocks.forEach((block, index) => {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.categoriesVisible.update(arr => {
            const copy = [...arr];
            copy[index] = true;
            return copy;
          });
          obs.disconnect();
        }
      }, { threshold: 0.06 });
      obs.observe(block.nativeElement);
    });

    // Observe remaining sections
    this.remainingSections.forEach((section) => {
      const label = section.nativeElement.getAttribute('data-section-name');
      const visibilitySignal = label === 'stats' ? this.statsVisible : label === 'benefits' ? this.benefitsVisible : this.ctaVisible;

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          visibilitySignal.set(true);
          obs.disconnect();
        }
      }, { threshold: 0.1 });
      obs.observe(section.nativeElement);
    });
  }
}
