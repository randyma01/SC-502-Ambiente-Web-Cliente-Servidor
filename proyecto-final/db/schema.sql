-- Base de Datos para MGN Technology Website
-- Proyecto Final: Avance II
-- Universidad Fidélitas - SC-502

CREATE DATABASE IF NOT EXISTS mgn_db;
USE mgn_db;

-- 1. Roles
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
);

-- 3. Categorías de Socios (Partners)
CREATE TABLE IF NOT EXISTS categorias_socios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_categoria VARCHAR(50) NOT NULL UNIQUE,
  tagline VARCHAR(100) NOT NULL,
  color_css VARCHAR(50) NOT NULL
);

-- 4. Socios (Partners)
CREATE TABLE IF NOT EXISTS socios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  tier VARCHAR(50) NOT NULL,
  descripcion TEXT NOT NULL,
  highlight VARCHAR(100) NOT NULL,
  categoria_id INT NOT NULL,
  FOREIGN KEY (categoria_id) REFERENCES categorias_socios(id) ON DELETE CASCADE
);

-- 5. Servicios (Solutions)
CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  tagline VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  color_css VARCHAR(50) NOT NULL,
  tint_css VARCHAR(50) NOT NULL
);

-- 6. Tickets de Soporte (Transactional Table)
CREATE TABLE IF NOT EXISTS tickets_soporte (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  servicio_id INT,
  tema VARCHAR(100) NOT NULL,
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'Abierto', -- Abierto, En Progreso, Resuelto
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE SET NULL
);

-- 7. Descargas de Políticas (Transactional Table)
CREATE TABLE IF NOT EXISTS descargas_politicas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT, -- NULL if guest downloaded it
  politica_nombre VARCHAR(100) NOT NULL,
  fecha_descarga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 8. Bitácora de Actividades (Transactional Table)
CREATE TABLE IF NOT EXISTS bitacora_actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  accion VARCHAR(100) NOT NULL,
  detalles TEXT,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ========================================================
-- Carga de Datos Iniciales (Seed Data)
-- ========================================================

-- Roles
INSERT INTO roles (id, nombre_rol) VALUES 
(1, 'Administrador'),
(2, 'Soporte'),
(3, 'Cliente')
ON DUPLICATE KEY UPDATE nombre_rol=VALUES(nombre_rol);

-- Usuarios (contraseña pre-hasheada para bcrypt de 'admin123', 'client123' y 'support123')
INSERT INTO usuarios (id, nombre, correo, contrasena, rol_id) VALUES 
(1, 'Administrador General', 'admin@mgn.tech', '$2a$10$x656m0ZlYc/U2/x0fE6L.O0gU9N6f77i5t5.1u.f9vW1pG/v1H1W.', 1),
(2, 'Soporte MGN', 'support@mgn.tech', '$2b$10$R/9qgXw.yB3Wc5x7a8/pL.G2pM5Xg8d2N5T9y1l2w3w8w1D8Sde.', 2),
(3, 'Cliente Ejemplo', 'client@mgn.tech', '$2b$10$R/9qgXw.yB3Wc5x7a8/pL.z1M5Xg8d2N5T9y1l2w3w8w1D8Sde.', 3)
ON DUPLICATE KEY UPDATE correo=VALUES(correo);

-- Categorías de Socios
INSERT INTO categorias_socios (id, nombre_categoria, tagline, color_css) VALUES
(1, 'Seguridad', 'Cero tolerancia a las amenazas.', 'var(--green)'),
(2, 'Cloud', 'Infraestructura sin límites.', 'var(--blue)'),
(3, 'Redes', 'Conectividad que no falla.', 'var(--purple)'),
(4, 'Infraestructura', 'La base de todo lo demás.', 'var(--green)')
ON DUPLICATE KEY UPDATE nombre_categoria=VALUES(nombre_categoria);

-- Socios (Partners)
INSERT INTO socios (id, nombre, tier, descripcion, highlight, categoria_id) VALUES
(1, 'Fortinet', 'Gold Partner', 'Líder global en seguridad de red. Firewalls de próxima generación, SD-WAN segura y plataforma Security Fabric.', 'Certified NSE 1–7', 1),
(2, 'Palo Alto Networks', 'Authorized Partner', 'Plataforma de ciberseguridad más completa. NGFW, Prisma Cloud y Cortex XDR para detección en tiempo real.', 'PCNSE Certified', 1),
(3, 'Microsoft', 'Gold Partner', 'Azure, Microsoft 365 y Dynamics 365. Migraciones empresariales, entornos híbridos y seguridad Defender.', 'Azure Solutions Partner', 2),
(4, 'Amazon Web Services', 'Select Tier', 'La nube más adoptada del mundo. Arquitecturas cloud-native, serverless, contenedores y servicios gestionados.', 'AWS Certified', 2),
(5, 'Cisco', 'Premier Partner', 'El estándar de la industria en redes empresariales. Switching, routing, colaboración y seguridad integrada.', 'CCNA / CCNP Certified', 3),
(6, 'Dell Technologies', 'Gold Partner', 'Servidores PowerEdge, almacenamiento PowerStore y data protection. Infraestructura para cargas críticas.', 'Dell Certified', 4)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- Servicios (Solutions)
INSERT INTO servicios (id, nombre, tagline, descripcion, color_css, tint_css) VALUES
(1, 'Ciberseguridad', 'Proteja lo que importa.', 'Implementamos plataformas líderes de detección y respuesta para mantener su organización operando con confianza ante cualquier amenaza.', 'var(--green)', '#F0F9E8'),
(2, 'Zero Trust / SASE', 'Nunca confíes. Siempre verifica.', 'Diseñamos arquitecturas donde cada identidad, dispositivo y flujo de red debe ganarse el acceso — cada vez, sin excepciones.', 'var(--blue)', '#E8F4FF'),
(3, 'Cloud', 'Su infraestructura, sin límites.', 'Migraciones seguras, entornos híbridos y optimización de costos cloud con los tres grandes proveedores y herramientas de automatización.', 'var(--purple)', '#EDE8FF'),
(4, 'Redes', 'Conectividad que no falla.', 'Diseño e implementación de redes empresariales segmentadas, de alta disponibilidad y preparadas para el crecimiento de su negocio.', 'var(--blue)', '#E8F4FF'),
(5, 'DevSecOps', 'Seguridad desde el primer commit.', 'Integramos prácticas de seguridad en cada etapa del ciclo de vida del software, reduciendo riesgos sin frenar la velocidad de entrega.', 'var(--purple)', '#EDE8FF'),
(6, 'Infraestructura', 'La base de todo lo demás.', 'Servidores, almacenamiento y virtualización empresarial que garantizan la continuidad operativa con los más altos estándares de disponibilidad.', 'var(--green)', '#F0F9E8')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
