const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MySQL connection pool configuration
const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mgn_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log(`Pool de conexión MySQL creado para ${dbConfig.host}:${dbConfig.port}`);
} catch (err) {
  console.error('Error al inicializar el pool de base de datos:', err.message);
}

// Helper: check DB connection & run query
async function query(sql, params) {
  if (!pool) {
    throw new Error('El pool de conexión a la base de datos no está inicializado.');
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

// Log activity helper
async function logActivity(userId, action, details = null) {
  try {
    await query(
      'INSERT INTO bitacora_actividades (usuario_id, accion, detalles) VALUES (?, ?, ?)',
      [userId, action, details]
    );
  } catch (err) {
    console.error('Error al insertar en bitacora_actividades:', err.message);
  }
}

// ========================================================
// MIDDLEWARES DE AUTENTICACIÓN Y ROLES
// ========================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación requerido.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'mgn_super_secret_jwt_key_2026', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado: permisos insuficientes.' });
    }
    next();
  };
}

// ========================================================
// ENDPOINTS DE AUTENTICACIÓN
// ========================================================

// Registro de Usuario
app.post('/api/auth/register', async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    // Check if user exists
    const users = await query('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (users.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedContrasena = await bcrypt.hash(contrasena, salt);

    // Insert user (default role 3: Cliente)
    const result = await query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol_id) VALUES (?, ?, ?, 3)',
      [nombre, correo, hashedContrasena]
    );

    const newUserId = result.insertId;
    await logActivity(newUserId, 'Registro', `Usuario registrado exitosamente: ${correo}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUserId, nombre, correo, rol: 'Cliente' },
      process.env.JWT_SECRET || 'mgn_super_secret_jwt_key_2026',
      { expiresIn: '8h' }
    );

    res.status(201).json({
      token,
      user: { id: newUserId, nombre, correo, rol: 'Cliente' }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message });
  }
});

// Inicio de Sesión (Login)
app.post('/api/auth/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Correo y contraseña requeridos.' });
  }

  try {
    const users = await query(
      `SELECT u.id, u.nombre, u.correo, u.contrasena, r.nombre_rol 
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.correo = ?`,
      [correo]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, nombre: user.nombre, correo: user.correo, rol: user.nombre_rol },
      process.env.JWT_SECRET || 'mgn_super_secret_jwt_key_2026',
      { expiresIn: '8h' }
    );

    await logActivity(user.id, 'Login', 'Inicio de sesión exitoso.');

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.nombre_rol }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message });
  }
});

// Perfil de Usuario
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const users = await query(
      `SELECT u.id, u.nombre, u.correo, r.nombre_rol 
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id
       WHERE u.id = ?`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({ user: users[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error interno del servidor.', error: err.message });
  }
});

// ========================================================
// ENDPOINTS DE SERVICIOS Y SOCIOS
// ========================================================

// Obtener Servicios (Solutions)
app.get('/api/servicios', async (req, res) => {
  try {
    const servicios = await query('SELECT id, nombre, tagline, descripcion, color_css, tint_css FROM servicios');
    res.json(servicios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener servicios.', error: err.message });
  }
});

// Obtener Socios (Partners)
app.get('/api/partners', async (req, res) => {
  try {
    const socios = await query(
      `SELECT s.id, s.nombre, s.tier, s.descripcion, s.highlight, c.nombre_categoria, c.tagline as categoria_tagline, c.color_css
       FROM socios s
       JOIN categorias_socios c ON s.categoria_id = c.id`
    );
    res.json(socios);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener partners.', error: err.message });
  }
});

// ========================================================
// ENDPOINTS DE TICKETS (TRANSACTIONAL)
// ========================================================

// Registrar Ticket de Soporte
app.post('/api/tickets', authenticateToken, async (req, res) => {
  const { servicioId, tema, mensaje } = req.body;

  if (!tema || !mensaje) {
    return res.status(400).json({ message: 'Tema de consulta y mensaje son requeridos.' });
  }

  try {
    // Insert ticket
    const result = await query(
      'INSERT INTO tickets_soporte (usuario_id, servicio_id, tema, mensaje) VALUES (?, ?, ?, ?)',
      [req.user.userId, servicioId || null, tema, mensaje]
    );

    await logActivity(req.user.userId, 'Creación de Ticket', `Ticket ID: ${result.insertId} - Tema: ${tema}`);

    res.status(201).json({
      message: 'Ticket de soporte registrado correctamente.',
      ticketId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar ticket.', error: err.message });
  }
});

// Obtener Tickets (Filtrado por Rol)
app.get('/api/tickets', authenticateToken, async (req, res) => {
  try {
    let tickets;
    if (req.user.rol === 'Cliente') {
      // Clients see only their tickets
      tickets = await query(
        `SELECT t.id, t.tema, t.mensaje, t.estado, t.fecha_creacion, s.nombre as servicio_nombre
         FROM tickets_soporte t
         LEFT JOIN servicios s ON t.servicio_id = s.id
         WHERE t.usuario_id = ?
         ORDER BY t.fecha_creacion DESC`,
        [req.user.userId]
      );
    } else {
      // Support & Admin see all tickets with customer details
      tickets = await query(
        `SELECT t.id, t.tema, t.mensaje, t.estado, t.fecha_creacion, u.nombre as cliente_nombre, u.correo as cliente_correo, s.nombre as servicio_nombre
         FROM tickets_soporte t
         JOIN usuarios u ON t.usuario_id = u.id
         LEFT JOIN servicios s ON t.servicio_id = s.id
         ORDER BY t.fecha_creacion DESC`
      );
    }
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener tickets.', error: err.message });
  }
});

// Actualizar Estado de Ticket (Support & Admin)
app.put('/api/tickets/:id/estado', authenticateToken, requireRole(['Soporte', 'Administrador']), async (req, res) => {
  const { estado } = req.body;
  const ticketId = req.params.id;

  const validEstados = ['Abierto', 'En Progreso', 'Resuelto'];
  if (!validEstados.includes(estado)) {
    return res.status(400).json({ message: 'Estado de ticket inválido.' });
  }

  try {
    const result = await query(
      'UPDATE tickets_soporte SET estado = ? WHERE id = ?',
      [estado, ticketId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Ticket no encontrado.' });
    }

    await logActivity(req.user.userId, 'Actualización de Ticket', `Cambio de estado ticket ID: ${ticketId} a ${estado}`);

    res.json({ message: 'Estado del ticket actualizado exitosamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar ticket.', error: err.message });
  }
});

// ========================================================
// ENDPOINTS DE LOGS Y AUDITORÍA
// ========================================================

// Registrar Descarga de Políticas (Transactional log)
app.post('/api/logs/descarga', async (req, res) => {
  const { token, politicaNombre } = req.body;

  if (!politicaNombre) {
    return res.status(400).json({ message: 'Nombre de política es requerido.' });
  }

  let userId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mgn_super_secret_jwt_key_2026');
      userId = decoded.userId;
    } catch (e) {
      // Ignore token decode error (allow guest logs)
    }
  }

  try {
    await query(
      'INSERT INTO descargas_politicas (usuario_id, politica_nombre) VALUES (?, ?)',
      [userId, politicaNombre]
    );

    if (userId) {
      await logActivity(userId, 'Descarga de Política', `Descargó: ${politicaNombre}`);
    }

    res.status(201).json({ message: 'Descarga registrada exitosamente.' });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar descarga.', error: err.message });
  }
});

// Obtener Bitácora de Actividades (Admin only)
app.get('/api/logs/actividades', authenticateToken, requireRole(['Administrador']), async (req, res) => {
  try {
    const logs = await query(
      `SELECT b.id, b.accion, b.detalles, b.fecha_hora, u.nombre as usuario_nombre, u.correo as usuario_correo, r.nombre_rol
       FROM bitacora_actividades b
       LEFT JOIN usuarios u ON b.usuario_id = u.id
       LEFT JOIN roles r ON u.rol_id = r.id
       ORDER BY b.fecha_hora DESC
       LIMIT 100`
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener bitácora.', error: err.message });
  }
});

// Obtener Registro de Descargas (Support & Admin only)
app.get('/api/logs/descargas', authenticateToken, requireRole(['Soporte', 'Administrador']), async (req, res) => {
  try {
    const descargas = await query(
      `SELECT d.id, d.politica_nombre, d.fecha_descarga, u.nombre as usuario_nombre, u.correo as usuario_correo
       FROM descargas_politicas d
       LEFT JOIN usuarios u ON d.usuario_id = u.id
       ORDER BY d.fecha_descarga DESC
       LIMIT 100`
    );
    res.json(descargas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener descargas.', error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Servidor de API corriendo en http://localhost:${PORT}`);
});
