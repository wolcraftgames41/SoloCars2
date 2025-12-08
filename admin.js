// ==================== CONFIGURACIÓN ADMIN ====================
const ADMIN_CONFIG = {
    itemsPorPagina: 10,
    tiendasDisponibles: ['AutoMundo', 'MotorMax', 'AutoPlus', 'TiendaAuto', 'VehículosPro', 'RepuestosCL', 'AutoParts Store']
};

// ==================== VARIABLES GLOBALES ADMIN ====================
let productosAdmin = [];
let productoEditandoId = null;
let paginaActualAdmin = 1;
let productosFiltrados = [];

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    cargarProductosAdmin();
    inicializarEventos();
    generarInputsPrecios();
    actualizarEstadisticas();
    mostrarProductosTabla();
    cargarPreferenciaDarkMode();
});

// ==================== CARGAR PRODUCTOS ====================
function cargarProductosAdmin() {
    // Cargar productos desde script.js
    if (typeof productos !== 'undefined') {
        productosAdmin = JSON.parse(JSON.stringify(productos));
    } else {
        productosAdmin = [];
    }
    productosFiltrados = [...productosAdmin];
}

// ==================== EVENTOS ====================
function inicializarEventos() {
    // Dark Mode
    const btnDarkMode = document.getElementById('btn-dark-mode');
    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', toggleDarkMode);
    }

    // Formulario
    const formProducto = document.getElementById('form-producto');
    if (formProducto) {
        formProducto.addEventListener('submit', guardarProducto);
    }

    // Botón cancelar
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cancelarEdicion);
    }

    // Agregar precio
    const btnAgregarPrecio = document.getElementById('btn-agregar-precio');
    if (btnAgregarPrecio) {
        btnAgregarPrecio.addEventListener('click', agregarCampoPrecio);
    }

    // Búsqueda y filtros
    const buscarAdmin = document.getElementById('buscar-admin');
    if (buscarAdmin) {
        buscarAdmin.addEventListener('input', aplicarFiltrosAdmin);
    }

    const filtroCategoria = document.getElementById('filtro-categoria');
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', aplicarFiltrosAdmin);
    }

    const ordenarAdmin = document.getElementById('ordenar-admin');
    if (ordenarAdmin) {
        ordenarAdmin.addEventListener('change', aplicarFiltrosAdmin);
    }

    const btnLimpiarFiltros = document.getElementById('btn-limpiar-filtros');
    if (btnLimpiarFiltros) {
        btnLimpiarFiltros.addEventListener('click', limpiarFiltrosAdmin);
    }

    // Exportar
    const btnExportar = document.getElementById('btn-exportar');
    if (btnExportar) {
        btnExportar.addEventListener('click', exportarJSON);
    }
}

// ==================== GENERAR INPUTS DE PRECIOS ====================
function generarInputsPrecios(precios = null) {
    const container = document.getElementById('precios-inputs');
    if (!container) return;

    container.innerHTML = '';

    if (!precios || precios.length === 0) {
        agregarCampoPrecio();
        return;
    }

    precios.forEach((precio, index) => {
        const div = document.createElement('div');
        div.className = 'precio-input-group mb-2';
        div.innerHTML = `
            <div class="row">
                <div class="col-md-5">
                    <select class="form-control tienda-select" required>
                        <option value="">Seleccionar tienda</option>
                        ${ADMIN_CONFIG.tiendasDisponibles.map(t => 
                            `<option value="${t}" ${t === precio.tienda ? 'selected' : ''}>${t}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-md-5">
                    <input type="number" class="form-control precio-input" placeholder="Precio" value="${precio.precio}" required>
                </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger btn-sm w-100 btn-eliminar-precio">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);

        // Evento eliminar
        const btnEliminar = div.querySelector('.btn-eliminar-precio');
        btnEliminar.addEventListener('click', () => {
            if (container.children.length > 1) {
                div.remove();
            } else {
                alert('Debe haber al menos una tienda con precio.');
            }
        });
    });
}

function agregarCampoPrecio() {
    const container = document.getElementById('precios-inputs');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'precio-input-group mb-2';
    div.innerHTML = `
        <div class="row">
            <div class="col-md-5">
                <select class="form-control tienda-select" required>
                    <option value="">Seleccionar tienda</option>
                    ${ADMIN_CONFIG.tiendasDisponibles.map(t => 
                        `<option value="${t}">${t}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="col-md-5">
                <input type="number" class="form-control precio-input" placeholder="Precio" required>
            </div>
            <div class="col-md-2">
                <button type="button" class="btn btn-danger btn-sm w-100 btn-eliminar-precio">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(div);

    // Evento eliminar
    const btnEliminar = div.querySelector('.btn-eliminar-precio');
    btnEliminar.addEventListener('click', () => {
        if (container.children.length > 1) {
            div.remove();
        } else {
            alert('Debe haber al menos una tienda con precio.');
        }
    });
}

// ==================== GUARDAR PRODUCTO ====================
function guardarProducto(e) {
    e.preventDefault();

    const nombre = document.getElementById('producto-nombre').value.trim();
    const categoria = document.getElementById('producto-categoria').value;

    // Obtener precios
    const tiendasSelects = document.querySelectorAll('.tienda-select');
    const preciosInputs = document.querySelectorAll('.precio-input');
    
    const precios = [];
    const tiendasUsadas = new Set();

    for (let i = 0; i < tiendasSelects.length; i++) {
        const tienda = tiendasSelects[i].value;
        const precio = parseInt(preciosInputs[i].value);

        if (!tienda || !precio) {
            alert('Completa todos los campos de tienda y precio.');
            return;
        }

        if (tiendasUsadas.has(tienda)) {
            alert(`La tienda "${tienda}" está duplicada. Cada tienda debe aparecer una sola vez.`);
            return;
        }

        tiendasUsadas.add(tienda);
        precios.push({ tienda, precio });
    }

    if (precios.length === 0) {
        alert('Agrega al menos un precio.');
        return;
    }

    // Crear o editar producto
    if (productoEditandoId !== null) {
        // Editar
        const index = productosAdmin.findIndex(p => p.id === productoEditandoId);
        if (index !== -1) {
            productosAdmin[index] = {
                ...productosAdmin[index],
                nombre,
                categoria,
                precios
            };
        }
        productoEditandoId = null;
    } else {
        // Crear nuevo
        const nuevoId = productosAdmin.length > 0 
            ? Math.max(...productosAdmin.map(p => p.id)) + 1 
            : 1;
        
        const nuevoProducto = {
            id: nuevoId,
            nombre,
            categoria,
            precios
        };
        
        productosAdmin.push(nuevoProducto);
    }

    // Resetear formulario
    document.getElementById('form-producto').reset();
    generarInputsPrecios();
    cancelarEdicion();

    // Actualizar vista
    aplicarFiltrosAdmin();
    actualizarEstadisticas();

    alert('Producto guardado exitosamente');
}

// ==================== EDITAR PRODUCTO ====================
function editarProducto(id) {
    const producto = productosAdmin.find(p => p.id === id);
    if (!producto) return;

    productoEditandoId = id;

    // Llenar formulario
    document.getElementById('producto-nombre').value = producto.nombre;
    document.getElementById('producto-categoria').value = producto.categoria;
    
    generarInputsPrecios(producto.precios);

    // Cambiar título y botón
    document.getElementById('form-titulo').innerHTML = '<i class="fas fa-edit"></i> Editar Producto';
    document.getElementById('btn-texto').textContent = 'Actualizar Producto';

    // Scroll al formulario
    document.getElementById('form-producto').scrollIntoView({ behavior: 'smooth' });
}

// ==================== ELIMINAR PRODUCTO ====================
function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    const index = productosAdmin.findIndex(p => p.id === id);
    if (index !== -1) {
        productosAdmin.splice(index, 1);
        aplicarFiltrosAdmin();
        actualizarEstadisticas();
        alert('Producto eliminado exitosamente');
    }
}

// ==================== CANCELAR EDICIÓN ====================
function cancelarEdicion() {
    productoEditandoId = null;
    document.getElementById('form-producto').reset();
    document.getElementById('form-titulo').innerHTML = '<i class="fas fa-plus-circle"></i> Agregar Nuevo Producto';
    document.getElementById('btn-texto').textContent = 'Guardar Producto';
    generarInputsPrecios();
}

// ==================== FILTROS ====================
function aplicarFiltrosAdmin() {
    const busqueda = document.getElementById('buscar-admin').value.toLowerCase().trim();
    const categoria = document.getElementById('filtro-categoria').value;
    const ordenar = document.getElementById('ordenar-admin').value;

    // Filtrar
    productosFiltrados = productosAdmin.filter(p => {
        const coincideNombre = p.nombre.toLowerCase().includes(busqueda);
        const coincideCategoria = categoria === 'todos' || p.categoria === categoria;
        return coincideNombre && coincideCategoria;
    });

    // Ordenar
    switch(ordenar) {
        case 'nombre':
            productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'categoria':
            productosFiltrados.sort((a, b) => a.categoria.localeCompare(b.categoria));
            break;
        case 'id':
        default:
            productosFiltrados.sort((a, b) => a.id - b.id);
            break;
    }

    paginaActualAdmin = 1;
    mostrarProductosTabla();
}

function limpiarFiltrosAdmin() {
    document.getElementById('buscar-admin').value = '';
    document.getElementById('filtro-categoria').value = 'todos';
    document.getElementById('ordenar-admin').value = 'id';
    aplicarFiltrosAdmin();
}

// ==================== MOSTRAR PRODUCTOS EN TABLA ====================
function mostrarProductosTabla() {
    const tbody = document.getElementById('tabla-admin-productos');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (productosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No hay productos para mostrar</td></tr>';
        return;
    }

    const inicio = (paginaActualAdmin - 1) * ADMIN_CONFIG.itemsPorPagina;
    const fin = inicio + ADMIN_CONFIG.itemsPorPagina;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    productosPagina.forEach(producto => {
        const precios = producto.precios.map(p => p.precio);
        const precioMin = Math.min(...precios);
        const precioMax = Math.max(...precios);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${producto.id}</strong></td>
            <td>${producto.nombre}</td>
            <td><span class="badge bg-${producto.categoria === 'autos' ? 'primary' : 'success'}">${producto.categoria}</span></td>
            <td>${producto.precios.length}</td>
            <td class="text-success"><strong>${formatearPrecio(precioMin)}</strong></td>
            <td class="text-danger">${formatearPrecio(precioMax)}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProducto(${producto.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    generarPaginacionAdmin();
}

// ==================== PAGINACIÓN ====================
function generarPaginacionAdmin() {
    const paginacion = document.getElementById('paginacion-admin');
    if (!paginacion) return;

    paginacion.innerHTML = '';

    const totalPaginas = Math.ceil(productosFiltrados.length / ADMIN_CONFIG.itemsPorPagina);

    if (totalPaginas <= 1) return;

    // Anterior
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${paginaActualAdmin === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = '<a class="page-link" href="#"><i class="fas fa-chevron-left"></i></a>';
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActualAdmin > 1) {
            paginaActualAdmin--;
            mostrarProductosTabla();
        }
    });
    paginacion.appendChild(prevLi);

    // Páginas
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === paginaActualAdmin ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            paginaActualAdmin = i;
            mostrarProductosTabla();
        });
        paginacion.appendChild(li);
    }

    // Siguiente
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${paginaActualAdmin === totalPaginas ? 'disabled' : ''}`;
    nextLi.innerHTML = '<a class="page-link" href="#"><i class="fas fa-chevron-right"></i></a>';
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActualAdmin < totalPaginas) {
            paginaActualAdmin++;
            mostrarProductosTabla();
        }
    });
    paginacion.appendChild(nextLi);
}

// ==================== ESTADÍSTICAS ====================
function actualizarEstadisticas() {
    const totalAutos = productosAdmin.filter(p => p.categoria === 'autos').length;
    const totalRepuestos = productosAdmin.filter(p => p.categoria === 'repuestos').length;
    const totalProductos = productosAdmin.length;

    document.getElementById('total-autos').textContent = totalAutos;
    document.getElementById('total-repuestos').textContent = totalRepuestos;
    document.getElementById('total-productos').textContent = totalProductos;
}

// ==================== EXPORTAR JSON ====================
function exportarJSON() {
    const dataStr = JSON.stringify(productosAdmin, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'productos_export.json';
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Productos exportados exitosamente');
}

// ==================== DARK MODE ====================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    guardarLocalStorage('darkMode', isDark);
    actualizarBotonDarkMode();
}

function actualizarBotonDarkMode() {
    const btnDarkMode = document.getElementById('btn-dark-mode');
    if (!btnDarkMode) return;

    if (document.body.classList.contains('dark-mode')) {
        btnDarkMode.innerHTML = '<i class="fas fa-sun"></i> Light';
        btnDarkMode.classList.remove('btn-outline-light');
        btnDarkMode.classList.add('btn-warning');
    } else {
        btnDarkMode.innerHTML = '<i class="fas fa-moon"></i> Dark';
        btnDarkMode.classList.remove('btn-warning');
        btnDarkMode.classList.add('btn-outline-light');
    }
}

function cargarPreferenciaDarkMode() {
    const darkModeGuardado = obtenerLocalStorage('darkMode') === 'true';
    if (darkModeGuardado) {
        document.body.classList.add('dark-mode');
    }
    actualizarBotonDarkMode();
}

// ==================== UTILIDADES ====================
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(precio);
}

function guardarLocalStorage(clave, valor) {
    try {
        localStorage.setItem(clave, valor);
    } catch (e) {
        console.warn('localStorage no disponible:', e.message);
    }
}

function obtenerLocalStorage(clave, valorDefecto = null) {
    try {
        return localStorage.getItem(clave) || valorDefecto;
    } catch (e) {
        console.warn('localStorage no disponible:', e.message);
        return valorDefecto;
    }
}
// ======================================================== 
// ==================== FIN ADMIN.JS ====================
// ========================================================
