import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, QueryList, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageBackground } from '../../components/page-background/page-background';

interface SolutionItem {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  color: string;
  tint: string;
  description: string;
  capabilities: string[];
  differentiator: string;
  tech: string[];
  hoverClass: string;
}

interface ProcessStep {
  step: string;
  name: string;
  desc: string;
  color: string;
}

interface ProofItem {
  value: string;
  label: string;
  color: string;
}

@Component({
  selector: 'app-soluciones',
  standalone: true,
  imports: [CommonModule, RouterLink, PageBackground],
  templateUrl: './soluciones.html',
  styleUrl: './soluciones.scss'
})
export class Soluciones implements OnInit, AfterViewInit {
  ready = signal(false);

  // Fade-in visibility array for each solution row, process, proof, and cta
  solutionsVisible = signal<boolean[]>([]);
  processVisible = signal(false);
  proofVisible = signal(false);
  ctaVisible = signal(false);

  @ViewChildren('solutionRow') solutionRows!: QueryList<ElementRef>;
  @ViewChildren('processSection, proofSection, ctaSection') remainingSections!: QueryList<ElementRef>;

  solutions: SolutionItem[] = [
    {
      id: '01', icon: 'bi-shield-shaded', name: 'Ciberseguridad', tagline: 'Proteja lo que importa.',
      color: 'var(--green)', tint: '#F0F9E8',
      description: 'Implementamos plataformas líderes de detección y respuesta para mantener su organización operando con confianza ante cualquier amenaza.',
      capabilities: ['NGFW & IPS', 'EDR / XDR', 'SIEM / SOAR', 'Pentesting', 'Gestión de vulnerabilidades'],
      differentiator: 'Certified NSE 1–7 · PCNSE · CrowdStrike',
      tech: ['Fortinet', 'Palo Alto', 'CrowdStrike', 'Splunk'],
      hoverClass: 'hover-card-tint-green'
    },
    {
      id: '02', icon: 'bi-lock-fill', name: 'Zero Trust / SASE', tagline: 'Nunca confíes. Siempre verifica.',
      color: 'var(--blue)', tint: '#E8F4FF',
      description: 'Diseñamos arquitecturas donde cada identidad, dispositivo y flujo de red debe ganarse el acceso — cada vez, sin excepciones.',
      capabilities: ['Identity & Access Management', 'Micro-segmentación', 'SD-WAN segura', 'ZTNA', 'Acceso privilegiado (PAM)'],
      differentiator: 'Arquitecturas Zero Trust auditadas',
      tech: ['Fortinet', 'Palo Alto Prisma', 'Cisco Duo', 'Okta'],
      hoverClass: 'hover-card-tint-blue'
    },
    {
      id: '03', icon: 'bi-cloud-arrow-up-fill', name: 'Cloud', tagline: 'Su infraestructura, sin límites.',
      color: 'var(--purple)', tint: '#EDE8FF',
      description: 'Migraciones seguras, entornos híbridos y optimización de costos cloud con los tres grandes proveedores y herramientas de automatización.',
      capabilities: ['Migración a nube', 'Arquitectura híbrida', 'FinOps', 'Kubernetes / contenedores', 'Backup cloud'],
      differentiator: 'Azure Solutions Partner · AWS Select · GCP Registered',
      tech: ['Azure', 'AWS', 'Google Cloud', 'Terraform'],
      hoverClass: 'hover-card-tint-purple'
    },
    {
      id: '04', icon: 'bi-diagram-3-fill', name: 'Redes', tagline: 'Conectividad que no falla.',
      color: 'var(--blue)', tint: '#E8F4FF',
      description: 'Diseño e implementación de redes empresariales segmentadas, de alta disponibilidad y preparadas para el crecimiento de su negocio.',
      capabilities: ['Switching & Routing', 'WiFi empresarial', 'SD-WAN', 'QoS & monitoreo', 'Data Center Networking'],
      differentiator: 'CCNA / CCNP · ACMA / ACMP Certified',
      tech: ['Cisco', 'Aruba', 'Juniper', 'Extreme'],
      hoverClass: 'hover-card-tint-blue'
    },
    {
      id: '05', icon: 'bi-code-slash', name: 'DevSecOps', tagline: 'Seguridad desde el primer commit.',
      color: 'var(--purple)', tint: '#EDE8FF',
      description: 'Integramos prácticas de seguridad en cada etapa del ciclo de vida del software, reduciendo riesgos sin frenar la velocidad de entrega.',
      capabilities: ['CI/CD seguro', 'SAST / DAST', 'Gestión de secretos', 'Container security', 'Cumplimiento como código'],
      differentiator: 'Pipelines seguros certificados',
      tech: ['GitLab', 'HashiCorp Vault', 'SonarQube', 'Trivy'],
      hoverClass: 'hover-card-tint-purple'
    },
    {
      id: '06', icon: 'bi-server', name: 'Infraestructura', tagline: 'La base de todo lo demás.',
      color: 'var(--green)', tint: '#F0F9E8',
      description: 'Servidores, almacenamiento y virtualización empresarial que garantizan la continuidad operativa con los más altos estándares de disponibilidad.',
      capabilities: ['Servidores & Storage', 'Virtualización', 'Backup & DR', 'HCI', 'Data Center físico'],
      differentiator: 'Dell Gold · HPE Silver · VMware Professional',
      tech: ['Dell', 'HPE', 'VMware', 'Veeam'],
      hoverClass: 'hover-card-tint-green'
    }
  ];

  processSteps: ProcessStep[] = [
    { step: '01', name: 'Diagnóstico', desc: 'Auditamos su entorno actual e identificamos brechas de seguridad y oportunidades de mejora.', color: 'var(--green)' },
    { step: '02', name: 'Diseño', desc: 'Elaboramos una arquitectura a la medida, alineada con sus objetivos de negocio y presupuesto.', color: 'var(--blue)' },
    { step: '03', name: 'Implementación', desc: 'Desplegamos la solución con ingenieros certificados en cada tecnología, sin interrumpir su operación.', color: 'var(--purple)' },
    { step: '04', name: 'Soporte 24/7', desc: 'Monitoreamos, gestionamos y evolucionamos su infraestructura con acuerdos de servicio claros.', color: 'var(--green)' }
  ];

  proof: ProofItem[] = [
    { value: '500+', label: 'Proyectos entregados', color: 'var(--green)' },
    { value: '20+', label: 'Años de trayectoria', color: 'var(--blue)' },
    { value: '100%', label: 'Costarricense', color: '#C4B5FD' }
  ];

  ngOnInit() {
    this.solutionsVisible.set(new Array(this.solutions.length).fill(false));
    setTimeout(() => this.ready.set(true), 80);
  }

  ngAfterViewInit() {
    // Observe solution rows
    this.solutionRows.forEach((row, index) => {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          this.solutionsVisible.update(arr => {
            const copy = [...arr];
            copy[index] = true;
            return copy;
          });
          obs.disconnect();
        }
      }, { threshold: 0.06 });
      obs.observe(row.nativeElement);
    });

    // Observe remaining sections
    this.remainingSections.forEach((section) => {
      const label = section.nativeElement.getAttribute('data-section-name');
      const visibilitySignal = label === 'process' ? this.processVisible : label === 'proof' ? this.proofVisible : this.ctaVisible;
      
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
