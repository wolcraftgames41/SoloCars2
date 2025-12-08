// ==================== SISTEMA DE AUTENTICACIÓN ====================

// Usuarios del sistema (en producción esto debería estar en un backend)
const USUARIOS = {
    'admin': {
        password: 'admin123',
        nombre: 'Administrador',
        rol: 'admin',
        permisos: ['crear', 'editar', 'eliminar', 'exportar', 'importar']
    },
    'editor': {
        password: 'editor123',
        nombre: 'Editor',
        rol: 'editor',
        permisos: ['crear', 'editar']
    }
};

// ==================== VALIDACIÓN DE SESIÓN ====================
function validarSesion() {
    const sesion = obtenerSesion();

    // Si no hay sesión, redirigir al login
    if (!sesion) {
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }

    // Verificar si la sesión ha expirado
    const ahora = new Date().getTime();
    const tiempoExpiracion = 2 * 60 * 60 * 1000; // 2 horas

    if (ahora - sesion.timestamp > tiempoExpiracion) {
        cerrarSesion();
        return false;
    }

    // Actualizar timestamp
    sesion.timestamp = ahora;
    guardarSesion(sesion);

    return true;
}

// ==================== LOGIN ====================
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en login.html
    if (window.location.pathname.includes('login.html')) {
        // Si ya hay sesión válida, redirigir al admin
        if (obtenerSesion()) {
            window.location.href = 'admin.html';
            return;
        }

        const loginForm = document.getElementById('login-form');
        const togglePassword = document.getElementById('toggle-password');

        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        if (togglePassword) {
            togglePassword.addEventListener('click', function() {
                const passwordInput = document.getElementById('password');
                const icon = this.querySelector('i');

                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        }
    }

    // Si estamos en admin.html
    if (window.location.pathname.includes('admin.html')) {
        if (!validarSesion()) {
            return;
        }
        mostrarInfoUsuario();
    }
});

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Validar credenciales
    const usuario = USUARIOS[username];

    if (!usuario || usuario.password !== password) {
        mostrarAlerta('Usuario o contraseña incorrectos', 'danger');
        return;
    }

    // Crear sesión
    const sesion = {
        username: username,
        nombre: usuario.nombre,
        rol: usuario.rol,
        permisos: usuario.permisos,
        timestamp: new Date().getTime(),
        rememberMe: rememberMe
    };

    guardarSesion(sesion);

    // Registrar en logs
    registrarLog('login', `Usuario ${usuario.nombre} inició sesión`);

    // Redirigir al panel admin
    window.location.href = 'admin.html';
}

// ==================== CERRAR SESIÓN ====================
function cerrarSesion() {
    const sesion = obtenerSesion();
    if (sesion) {
        registrarLog('logout', `Usuario ${sesion.nombre} cerró sesión`);
    }

    localStorage.removeItem('sesionAdmin');
    sessionStorage.removeItem('sesionAdmin');
    window.location.href = 'login.html';
}

// ==================== GESTIÓN DE SESIÓN ====================
function guardarSesion(sesion) {
    const datosString = JSON.stringify(sesion);

    if (sesion.rememberMe) {
        localStorage.setItem('sesionAdmin', datosString);
    } else {
        sessionStorage.setItem('sesionAdmin', datosString);
    }
}

function obtenerSesion() {
    const sesionLocal = localStorage.getItem('sesionAdmin');
    const sesionSession = sessionStorage.getItem('sesionAdmin');

    const sesionString = sesionLocal || sesionSession;

    if (!sesionString) return null;

    try {
        return JSON.parse(sesionString);
    } catch (e) {
        return null;
    }
}

function verificarPermiso(permiso) {
    const sesion = obtenerSesion();
    if (!sesion) return false;
    return sesion.permisos.includes(permiso);
}

// ==================== MOSTRAR INFO USUARIO ====================
function mostrarInfoUsuario() {
    const sesion = obtenerSesion();
    if (!sesion) return;

    const userInfoContainer = document.getElementById('user-info');
    if (userInfoContainer) {
        userInfoContainer.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="me-3">
                    <i class="fas fa-user-circle fa-2x text-primary"></i>
                </div>
                <div>
                    <strong>${sesion.nombre}</strong><br>
                    <small class="text-muted">Rol: ${sesion.rol}</small>
                </div>
            </div>
        `;
    }
}

// ==================== LOGS DE ACTIVIDAD ====================
function registrarLog(tipo, descripcion) {
    const sesion = obtenerSesion();
    const logs = obtenerLogs();

    const nuevoLog = {
        id: Date.now(),
        tipo: tipo,
        descripcion: descripcion,
        usuario: sesion ? sesion.nombre : 'Sistema',
        fecha: new Date().toISOString(),
        timestamp: new Date().getTime()
    };

    logs.unshift(nuevoLog);

    // Mantener solo los últimos 100 logs
    if (logs.length > 100) {
        logs.splice(100);
    }

    localStorage.setItem('activityLogs', JSON.stringify(logs));
}

function obtenerLogs() {
    try {
        const logs = localStorage.getItem('activityLogs');
        return logs ? JSON.parse(logs) : [];
    } catch (e) {
        return [];
    }
}

function mostrarLogs() {
    const logs = obtenerLogs();
    const container = document.getElementById('logs-container');

    if (!container) return;

    if (logs.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">No hay actividad registrada</p>';
        return;
    }

    const html = logs.map(log => {
        const fecha = new Date(log.fecha);
        const iconos = {
            'login': 'fa-sign-in-alt text-success',
            'logout': 'fa-sign-out-alt text-danger',
            'crear': 'fa-plus-circle text-primary',
            'editar': 'fa-edit text-warning',
            'eliminar': 'fa-trash text-danger',
            'importar': 'fa-file-import text-info',
            'exportar': 'fa-file-export text-info'
        };

        const icono = iconos[log.tipo] || 'fa-info-circle text-secondary';

        return `
            <div class="log-item mb-2 p-2 border-bottom">
                <div class="d-flex align-items-start">
                    <i class="fas ${icono} me-2 mt-1"></i>
                    <div class="flex-grow-1">
                        <strong>${log.descripcion}</strong><br>
                        <small class="text-muted">
                            ${log.usuario} - ${fecha.toLocaleString('es-CL')}
                        </small>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// ==================== ALERTAS ====================
function mostrarAlerta(mensaje, tipo = 'info') {
    const container = document.getElementById('alert-container');
    if (!container) return;

    const iconos = {
        'success': 'fa-check-circle',
        'danger': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };

    const icono = iconos[tipo] || iconos['info'];

    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} alert-dismissible fade show`;
    alert.innerHTML = `
        <i class="fas ${icono} me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.innerHTML = '';
    container.appendChild(alert);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// ==================== UTILIDADES ====================
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
