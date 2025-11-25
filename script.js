// ==================== CONFIGURACIÓN GLOBAL ====================
const CONFIG = {
  itemsPorPagina: 5,
  maxHistorial: 5,
  debounceDelay: 300,
  animationDuration: 300
};

// ==================== VARIABLES GLOBALES ====================
let historialBusquedas = [];
let resultadosActuales = [];
let paginaActual = 1;
let debounceTimer = null;

// Rating de tiendas (datos simulados)
const ratingTiendas = {
  'AutoMundo': { stars: 4.5, reviews: 1250 },
  'MotorMax': { stars: 4.8, reviews: 980 },
  'AutoPlus': { stars: 4.3, reviews: 856 },
  'TiendaAuto': { stars: 4.6, reviews: 1105 },
  'VehículosPro': { stars: 4.7, reviews: 945 },
  'RepuestosCL': { stars: 4.4, reviews: 1320 },
  'AutoParts Store': { stars: 4.9, reviews: 1456 }
};

// ==================== BASE DE DATOS (AMPLIADA: IDs 1 - 155) ====================
const productos = [
  // === (ORIGINALES 1-35) ===
  { id: 1, nombre: 'Toyota Corolla 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 18500000 },
    { tienda: 'MotorMax', precio: 18800000 },
    { tienda: 'AutoPlus', precio: 18200000 },
    { tienda: 'VehículosPro', precio: 18600000 },
    { tienda: 'TiendaAuto', precio: 18400000 }
  ]},
  { id: 2, nombre: 'Honda Civic 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 19200000 },
    { tienda: 'MotorMax', precio: 19500000 },
    { tienda: 'AutoPlus', precio: 18900000 },
    { tienda: 'TiendaAuto', precio: 19100000 },
    { tienda: 'VehículosPro', precio: 19300000 }
  ]},
  { id: 3, nombre: 'Hyundai Elantra 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 17500000 },
    { tienda: 'MotorMax', precio: 17800000 },
    { tienda: 'VehículosPro', precio: 17200000 },
    { tienda: 'AutoPlus', precio: 17600000 },
    { tienda: 'TiendaAuto', precio: 17400000 }
  ]},
  { id: 4, nombre: 'Kia Forte 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 16800000 },
    { tienda: 'MotorMax', precio: 17100000 },
    { tienda: 'AutoPlus', precio: 16500000 },
    { tienda: 'TiendaAuto', precio: 16900000 },
    { tienda: 'VehículosPro', precio: 16700000 }
  ]},
  { id: 5, nombre: 'Chevrolet Onix 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 15800000 },
    { tienda: 'VehículosPro', precio: 16100000 },
    { tienda: 'MotorMax', precio: 16000000 },
    { tienda: 'AutoPlus', precio: 15900000 },
    { tienda: 'TiendaAuto', precio: 15700000 }
  ]},
  { id: 6, nombre: 'Nissan Versa 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 14500000 },
    { tienda: 'MotorMax', precio: 14800000 },
    { tienda: 'AutoPlus', precio: 14200000 },
    { tienda: 'VehículosPro', precio: 14600000 },
    { tienda: 'TiendaAuto', precio: 14400000 }
  ]},
  { id: 7, nombre: 'Volkswagen Polo 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 17200000 },
    { tienda: 'MotorMax', precio: 17500000 },
    { tienda: 'AutoPlus', precio: 16900000 },
    { tienda: 'VehículosPro', precio: 17300000 },
    { tienda: 'TiendaAuto', precio: 17100000 }
  ]},
  { id: 8, nombre: 'Mazda 3 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 19800000 },
    { tienda: 'MotorMax', precio: 20100000 },
    { tienda: 'AutoPlus', precio: 19500000 },
    { tienda: 'VehículosPro', precio: 19900000 },
    { tienda: 'TiendaAuto', precio: 19700000 }
  ]},
  { id: 9, nombre: 'Subaru Impreza 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 21500000 },
    { tienda: 'MotorMax', precio: 21800000 },
    { tienda: 'AutoPlus', precio: 21200000 },
    { tienda: 'VehículosPro', precio: 21600000 },
    { tienda: 'TiendaAuto', precio: 21400000 }
  ]},
  { id: 10, nombre: 'Fiat Argo 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 13500000 },
    { tienda: 'MotorMax', precio: 13800000 },
    { tienda: 'AutoPlus', precio: 13200000 },
    { tienda: 'VehículosPro', precio: 13600000 },
    { tienda: 'TiendaAuto', precio: 13400000 }
  ]},
  { id: 11, nombre: 'Ford Focus 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 18200000 },
    { tienda: 'MotorMax', precio: 18500000 },
    { tienda: 'AutoPlus', precio: 17900000 },
    { tienda: 'VehículosPro', precio: 18300000 },
    { tienda: 'TiendaAuto', precio: 18100000 }
  ]},
  { id: 12, nombre: 'Peugeot 208 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 16500000 },
    { tienda: 'MotorMax', precio: 16800000 },
    { tienda: 'AutoPlus', precio: 16200000 },
    { tienda: 'VehículosPro', precio: 16600000 },
    { tienda: 'TiendaAuto', precio: 16400000 }
  ]},
  { id: 13, nombre: 'Renault Sandero 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 15200000 },
    { tienda: 'MotorMax', precio: 15500000 },
    { tienda: 'AutoPlus', precio: 14900000 },
    { tienda: 'VehículosPro', precio: 15300000 },
    { tienda: 'TiendaAuto', precio: 15100000 }
  ]},
  { id: 14, nombre: 'Suzuki Swift 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 14800000 },
    { tienda: 'MotorMax', precio: 15100000 },
    { tienda: 'AutoPlus', precio: 14500000 },
    { tienda: 'VehículosPro', precio: 14900000 },
    { tienda: 'TiendaAuto', precio: 14700000 }
  ]},
  { id: 15, nombre: 'BYD Qin 2023', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 12800000 },
    { tienda: 'MotorMax', precio: 13100000 },
    { tienda: 'AutoPlus', precio: 12500000 },
    { tienda: 'VehículosPro', precio: 12900000 },
    { tienda: 'TiendaAuto', precio: 12700000 }
  ]},
  // REPUESTOS 
  { id: 16, nombre: 'Pastillas de Freno (Juego)', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 45000 },
    { tienda: 'AutoParts Store', precio: 42000 },
    { tienda: 'AutoMundo', precio: 48000 },
    { tienda: 'TiendaAuto', precio: 43500 },
    { tienda: 'VehículosPro', precio: 44000 }
  ]},
  { id: 17, nombre: 'Aceite Sintético 5W30 (5L)', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 28000 },
    { tienda: 'AutoMundo', precio: 32000 },
    { tienda: 'AutoParts Store', precio: 27500 },
    { tienda: 'TiendaAuto', precio: 30000 },
    { tienda: 'VehículosPro', precio: 29000 }
  ]},
  { id: 18, nombre: 'Batería 60Ah', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 120000 },
    { tienda: 'AutoParts Store', precio: 115000 },
    { tienda: 'RepuestosCL', precio: 125000 },
    { tienda: 'AutoMundo', precio: 118000 },
    { tienda: 'VehículosPro', precio: 122000 }
  ]},
  { id: 19, nombre: 'Filtro de Aire', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 18000 },
    { tienda: 'AutoParts Store', precio: 17000 },
    { tienda: 'TiendaAuto', precio: 19000 },
    { tienda: 'AutoMundo', precio: 18500 },
    { tienda: 'VehículosPro', precio: 17500 }
  ]},
  { id: 20, nombre: 'Filtro de Aceite', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 12000 },
    { tienda: 'RepuestosCL', precio: 11500 },
    { tienda: 'AutoParts Store', precio: 11000 },
    { tienda: 'TiendaAuto', precio: 12500 },
    { tienda: 'VehículosPro', precio: 11800 }
  ]},
  { id: 21, nombre: 'Correa de Distribución', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 85000 },
    { tienda: 'RepuestosCL', precio: 82000 },
    { tienda: 'AutoMundo', precio: 88000 },
    { tienda: 'AutoParts Store', precio: 81000 },
    { tienda: 'VehículosPro', precio: 84000 }
  ]},
  { id: 22, nombre: 'Limpiaparabrisas (Par)', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 25000 },
    { tienda: 'AutoMundo', precio: 28000 },
    { tienda: 'AutoParts Store', precio: 24000 },
    { tienda: 'TiendaAuto', precio: 26500 },
    { tienda: 'VehículosPro', precio: 25500 }
  ]},
  { id: 23, nombre: 'Pastillas de Embrague', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 95000 },
    { tienda: 'RepuestosCL', precio: 92000 },
    { tienda: 'AutoMundo', precio: 98000 },
    { tienda: 'AutoParts Store', precio: 91000 },
    { tienda: 'VehículosPro', precio: 94000 }
  ]},
  { id: 24, nombre: 'Sensor de Oxígeno', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 65000 },
    { tienda: 'RepuestosCL', precio: 62000 },
    { tienda: 'AutoParts Store', precio: 61000 },
    { tienda: 'TiendaAuto', precio: 66000 },
    { tienda: 'VehículosPro', precio: 63000 }
  ]},
  { id: 25, nombre: 'Bujías (Juego de 4)', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 32000 },
    { tienda: 'AutoParts Store', precio: 30000 },
    { tienda: 'AutoMundo', precio: 35000 },
    { tienda: 'TiendaAuto', precio: 31000 },
    { tienda: 'VehículosPro', precio: 32500 }
  ]},
  { id: 26, nombre: 'Cables de Bujía', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 28000 },
    { tienda: 'RepuestosCL', precio: 26000 },
    { tienda: 'AutoMundo', precio: 30000 },
    { tienda: 'AutoParts Store', precio: 25000 },
    { tienda: 'VehículosPro', precio: 27000 }
  ]},
  { id: 27, nombre: 'Amortiguadores (Par)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 180000 },
    { tienda: 'RepuestosCL', precio: 170000 },
    { tienda: 'AutoParts Store', precio: 165000 },
    { tienda: 'TiendaAuto', precio: 182000 },
    { tienda: 'VehículosPro', precio: 175000 }
  ]},
  { id: 28, nombre: 'Discos de Freno (Par)', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 72000 },
    { tienda: 'AutoParts Store', precio: 68000 },
    { tienda: 'AutoMundo', precio: 75000 },
    { tienda: 'TiendaAuto', precio: 70000 },
    { tienda: 'VehículosPro', precio: 71000 }
  ]},
  { id: 29, nombre: 'Mangueras de Radiador (Juego)', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 35000 },
    { tienda: 'RepuestosCL', precio: 33000 },
    { tienda: 'AutoMundo', precio: 38000 },
    { tienda: 'AutoParts Store', precio: 32000 },
    { tienda: 'VehículosPro', precio: 34000 }
  ]},
  { id: 30, nombre: 'Correa Serpentina', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 42000 },
    { tienda: 'RepuestosCL', precio: 40000 },
    { tienda: 'AutoParts Store', precio: 38000 },
    { tienda: 'TiendaAuto', precio: 43000 },
    { tienda: 'VehículosPro', precio: 41000 }
  ]},
  { id: 31, nombre: 'Bomba de Agua', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 55000 },
    { tienda: 'RepuestosCL', precio: 52000 },
    { tienda: 'AutoMundo', precio: 58000 },
    { tienda: 'AutoParts Store', precio: 51000 },
    { tienda: 'VehículosPro', precio: 54000 }
  ]},
  { id: 32, nombre: 'Alternador', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 145000 },
    { tienda: 'RepuestosCL', precio: 135000 },
    { tienda: 'AutoParts Store', precio: 130000 },
    { tienda: 'TiendaAuto', precio: 148000 },
    { tienda: 'VehículosPro', precio: 140000 }
  ]},
  { id: 33, nombre: 'Compresor de Aire Acondicionado', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 185000 },
    { tienda: 'RepuestosCL', precio: 175000 },
    { tienda: 'AutoMundo', precio: 195000 },
    { tienda: 'AutoParts Store', precio: 170000 },
    { tienda: 'VehículosPro', precio: 182000 }
  ]},
  { id: 34, nombre: 'Pastillas de Freno Trasero', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 38000 },
    { tienda: 'AutoParts Store', precio: 35000 },
    { tienda: 'AutoMundo', precio: 41000 },
    { tienda: 'TiendaAuto', precio: 37000 },
    { tienda: 'VehículosPro', precio: 39000 }
  ]},
  { id: 35, nombre: 'Líquido de Frenos (1L)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 8500 },
    { tienda: 'RepuestosCL', precio: 8000 },
    { tienda: 'AutoParts Store', precio: 7500 },
    { tienda: 'TiendaAuto', precio: 9000 },
    { tienda: 'VehículosPro', precio: 8200 }
  ]},

  // === NUEVOS AUTOS (36-95) ===
  { id: 36, nombre: 'Toyota Corolla 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 18600000 },
    { tienda: 'MotorMax', precio: 18900000 },
    { tienda: 'AutoPlus', precio: 18450000 },
    { tienda: 'VehículosPro', precio: 18700000 }
  ]},
  { id: 37, nombre: 'Honda Civic 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 19500000 },
    { tienda: 'MotorMax', precio: 19800000 },
    { tienda: 'AutoPlus', precio: 19250000 },
    { tienda: 'TiendaAuto', precio: 19400000 }
  ]},
  { id: 38, nombre: 'Hyundai Elantra 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 17650000 },
    { tienda: 'MotorMax', precio: 17950000 },
    { tienda: 'VehículosPro', precio: 17400000 },
    { tienda: 'AutoPlus', precio: 17700000 }
  ]},
  { id: 39, nombre: 'Kia Forte 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 16950000 },
    { tienda: 'MotorMax', precio: 17200000 },
    { tienda: 'AutoPlus', precio: 16650000 },
    { tienda: 'VehículosPro', precio: 16850000 }
  ]},
  { id: 40, nombre: 'Chevrolet Onix 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 15950000 },
    { tienda: 'VehículosPro', precio: 16200000 },
    { tienda: 'MotorMax', precio: 16100000 },
    { tienda: 'AutoPlus', precio: 16000000 }
  ]},
  { id: 41, nombre: 'Nissan Versa 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 14650000 },
    { tienda: 'MotorMax', precio: 14900000 },
    { tienda: 'AutoPlus', precio: 14350000 },
    { tienda: 'VehículosPro', precio: 14700000 }
  ]},
  { id: 42, nombre: 'Volkswagen Polo 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 17350000 },
    { tienda: 'MotorMax', precio: 17600000 },
    { tienda: 'AutoPlus', precio: 17050000 },
    { tienda: 'VehículosPro', precio: 17400000 }
  ]},
  { id: 43, nombre: 'Mazda 3 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 19950000 },
    { tienda: 'MotorMax', precio: 20250000 },
    { tienda: 'AutoPlus', precio: 19600000 },
    { tienda: 'TiendaAuto', precio: 19800000 }
  ]},
  { id: 44, nombre: 'Subaru Impreza 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 21650000 },
    { tienda: 'MotorMax', precio: 21950000 },
    { tienda: 'AutoPlus', precio: 21300000 },
    { tienda: 'VehículosPro', precio: 21700000 }
  ]},
  { id: 45, nombre: 'Fiat Argo 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 13650000 },
    { tienda: 'MotorMax', precio: 13900000 },
    { tienda: 'AutoPlus', precio: 13350000 },
    { tienda: 'TiendaAuto', precio: 13500000 }
  ]},
  { id: 46, nombre: 'Ford Focus 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 18350000 },
    { tienda: 'MotorMax', precio: 18650000 },
    { tienda: 'AutoPlus', precio: 18000000 },
    { tienda: 'VehículosPro', precio: 18400000 }
  ]},
  { id: 47, nombre: 'Peugeot 208 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 16650000 },
    { tienda: 'MotorMax', precio: 16950000 },
    { tienda: 'AutoPlus', precio: 16300000 },
    { tienda: 'TiendaAuto', precio: 16500000 }
  ]},
  { id: 48, nombre: 'Renault Sandero 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 15350000 },
    { tienda: 'MotorMax', precio: 15600000 },
    { tienda: 'AutoPlus', precio: 15050000 },
    { tienda: 'VehículosPro', precio: 15250000 }
  ]},
  { id: 49, nombre: 'Suzuki Swift 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 14950000 },
    { tienda: 'MotorMax', precio: 15250000 },
    { tienda: 'AutoPlus', precio: 14800000 },
    { tienda: 'TiendaAuto', precio: 14750000 }
  ]},
  { id: 50, nombre: 'BYD Qin 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 12950000 },
    { tienda: 'MotorMax', precio: 13250000 },
    { tienda: 'AutoPlus', precio: 12800000 },
    { tienda: 'VehículosPro', precio: 13000000 }
  ]},
  { id: 51, nombre: 'Hyundai Tucson 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 22900000 },
    { tienda: 'MotorMax', precio: 23200000 },
    { tienda: 'AutoPlus', precio: 22800000 },
    { tienda: 'VehículosPro', precio: 23050000 }
  ]},
  { id: 52, nombre: 'Kia Seltos 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 18050000 },
    { tienda: 'MotorMax', precio: 18350000 },
    { tienda: 'AutoPlus', precio: 17900000 },
    { tienda: 'TiendaAuto', precio: 18100000 }
  ]},
  { id: 53, nombre: 'Toyota Yaris 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 14050000 },
    { tienda: 'MotorMax', precio: 14300000 },
    { tienda: 'AutoPlus', precio: 13900000 },
    { tienda: 'VehículosPro', precio: 14100000 }
  ]},
  { id: 54, nombre: 'Nissan Kicks 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 19800000 },
    { tienda: 'MotorMax', precio: 20100000 },
    { tienda: 'AutoPlus', precio: 19550000 },
    { tienda: 'TiendaAuto', precio: 19700000 }
  ]},
  { id: 55, nombre: 'Honda HR-V 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 20500000 },
    { tienda: 'MotorMax', precio: 20800000 },
    { tienda: 'AutoPlus', precio: 20200000 },
    { tienda: 'VehículosPro', precio: 20450000 }
  ]},
  { id: 56, nombre: 'Mazda CX-3 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 21500000 },
    { tienda: 'MotorMax', precio: 21800000 },
    { tienda: 'AutoPlus', precio: 21200000 },
    { tienda: 'TiendaAuto', precio: 21400000 }
  ]},
  { id: 57, nombre: 'Subaru XV 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 22500000 },
    { tienda: 'MotorMax', precio: 22800000 },
    { tienda: 'AutoPlus', precio: 22300000 },
    { tienda: 'VehículosPro', precio: 22600000 }
  ]},
  { id: 58, nombre: 'Volkswagen T-Cross 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 20000000 },
    { tienda: 'MotorMax', precio: 20300000 },
    { tienda: 'AutoPlus', precio: 19850000 },
    { tienda: 'TiendaAuto', precio: 19950000 }
  ]},
  { id: 59, nombre: 'Chevrolet Tracker 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 21000000 },
    { tienda: 'MotorMax', precio: 21300000 },
    { tienda: 'AutoPlus', precio: 20800000 },
    { tienda: 'VehículosPro', precio: 20950000 }
  ]},
  { id: 60, nombre: 'Ford EcoSport 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 19500000 },
    { tienda: 'MotorMax', precio: 19800000 },
    { tienda: 'AutoPlus', precio: 19200000 },
    { tienda: 'TiendaAuto', precio: 19350000 }
  ]},
  { id: 61, nombre: 'Renault Duster 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 18500000 },
    { tienda: 'MotorMax', precio: 18800000 },
    { tienda: 'AutoPlus', precio: 18300000 },
    { tienda: 'VehículosPro', precio: 18450000 }
  ]},
  { id: 62, nombre: 'Peugeot 2008 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 19550000 },
    { tienda: 'MotorMax', precio: 19850000 },
    { tienda: 'AutoPlus', precio: 19400000 },
    { tienda: 'TiendaAuto', precio: 19500000 }
  ]},
  { id: 63, nombre: 'Suzuki Baleno 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 13100000 },
    { tienda: 'MotorMax', precio: 13350000 },
    { tienda: 'AutoPlus', precio: 13000000 },
    { tienda: 'VehículosPro', precio: 13150000 }
  ]},
  { id: 64, nombre: 'Toyota CH-R 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 22000000 },
    { tienda: 'MotorMax', precio: 22300000 },
    { tienda: 'AutoPlus', precio: 21800000 },
    { tienda: 'TiendaAuto', precio: 21900000 }
  ]},
  { id: 65, nombre: 'Kia Rio 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 13350000 },
    { tienda: 'MotorMax', precio: 13600000 },
    { tienda: 'AutoPlus', precio: 13200000 },
    { tienda: 'VehículosPro', precio: 13400000 }
  ]},
  { id: 66, nombre: 'Honda Fit 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 14250000 },
    { tienda: 'MotorMax', precio: 14500000 },
    { tienda: 'AutoPlus', precio: 14100000 },
    { tienda: 'TiendaAuto', precio: 14200000 }
  ]},
  { id: 67, nombre: 'Mazda CX-30 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 21600000 },
    { tienda: 'MotorMax', precio: 21900000 },
    { tienda: 'AutoPlus', precio: 21500000 },
    { tienda: 'VehículosPro', precio: 21700000 }
  ]},
  { id: 68, nombre: 'Nissan Sentra 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 17000000 },
    { tienda: 'MotorMax', precio: 17300000 },
    { tienda: 'AutoPlus', precio: 16850000 },
    { tienda: 'TiendaAuto', precio: 16950000 }
  ]},
  { id: 69, nombre: 'Volkswagen Virtus 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 17800000 },
    { tienda: 'MotorMax', precio: 18100000 },
    { tienda: 'AutoPlus', precio: 17600000 },
    { tienda: 'VehículosPro', precio: 17750000 }
  ]},
  { id: 70, nombre: 'Chevrolet Spark GT 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 12650000 },
    { tienda: 'MotorMax', precio: 12900000 },
    { tienda: 'AutoPlus', precio: 12500000 },
    { tienda: 'TiendaAuto', precio: 12450000 }
  ]},
  { id: 71, nombre: 'Ford Ka 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 12000000 },
    { tienda: 'MotorMax', precio: 12250000 },
    { tienda: 'AutoPlus', precio: 11900000 },
    { tienda: 'VehículosPro', precio: 12050000 }
  ]},
  { id: 72, nombre: 'Renault Logan 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 14750000 },
    { tienda: 'MotorMax', precio: 15000000 },
    { tienda: 'AutoPlus', precio: 14600000 },
    { tienda: 'TiendaAuto', precio: 14700000 }
  ]},
  { id: 73, nombre: 'Peugeot 3008 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 24500000 },
    { tienda: 'MotorMax', precio: 24800000 },
    { tienda: 'AutoPlus', precio: 24300000 },
    { tienda: 'VehículosPro', precio: 24450000 }
  ]},
  { id: 74, nombre: 'Suzuki Vitara 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 23000000 },
    { tienda: 'MotorMax', precio: 23300000 },
    { tienda: 'AutoPlus', precio: 22800000 },
    { tienda: 'TiendaAuto', precio: 22950000 }
  ]},
  { id: 75, nombre: 'Toyota RAV4 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 25500000 },
    { tienda: 'MotorMax', precio: 25800000 },
    { tienda: 'AutoPlus', precio: 25200000 },
    { tienda: 'VehículosPro', precio: 25450000 }
  ]},
  { id: 76, nombre: 'Nissan Qashqai 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 23500000 },
    { tienda: 'MotorMax', precio: 23800000 },
    { tienda: 'AutoPlus', precio: 23200000 },
    { tienda: 'TiendaAuto', precio: 23350000 }
  ]},
  { id: 77, nombre: 'Volkswagen Golf 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 21000000 },
    { tienda: 'MotorMax', precio: 21300000 },
    { tienda: 'AutoPlus', precio: 20800000 },
    { tienda: 'VehículosPro', precio: 20950000 }
  ]},
  { id: 78, nombre: 'Chevrolet Cruze 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 17200000 },
    { tienda: 'MotorMax', precio: 17500000 },
    { tienda: 'AutoPlus', precio: 17000000 },
    { tienda: 'TiendaAuto', precio: 17150000 }
  ]},
  { id: 79, nombre: 'Ford Mustang 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 35000000 },
    { tienda: 'MotorMax', precio: 35500000 },
    { tienda: 'AutoPlus', precio: 34800000 },
    { tienda: 'VehículosPro', precio: 34950000 }
  ]},
  { id: 80, nombre: 'Hyundai Santa Fe 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 27000000 },
    { tienda: 'MotorMax', precio: 27300000 },
    { tienda: 'AutoPlus', precio: 26800000 },
    { tienda: 'TiendaAuto', precio: 26950000 }
  ]},
  { id: 81, nombre: 'Kia Sorento 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 28500000 },
    { tienda: 'MotorMax', precio: 28800000 },
    { tienda: 'AutoPlus', precio: 28300000 },
    { tienda: 'VehículosPro', precio: 28450000 }
  ]},
  { id: 82, nombre: 'Mazda CX-5 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 24000000 },
    { tienda: 'MotorMax', precio: 24300000 },
    { tienda: 'AutoPlus', precio: 23800000 },
    { tienda: 'TiendaAuto', precio: 23950000 }
  ]},
  { id: 83, nombre: 'Subaru Forester 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 26000000 },
    { tienda: 'MotorMax', precio: 26300000 },
    { tienda: 'AutoPlus', precio: 25800000 },
    { tienda: 'VehículosPro', precio: 25950000 }
  ]},
  { id: 84, nombre: 'Volkswagen Tiguan 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 26500000 },
    { tienda: 'MotorMax', precio: 26800000 },
    { tienda: 'AutoPlus', precio: 26300000 },
    { tienda: 'TiendaAuto', precio: 26450000 }
  ]},
  { id: 85, nombre: 'Chevrolet Captiva 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 22500000 },
    { tienda: 'MotorMax', precio: 22800000 },
    { tienda: 'AutoPlus', precio: 22300000 },
    { tienda: 'VehículosPro', precio: 22450000 }
  ]},
  { id: 86, nombre: 'Ford Edge 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 28000000 },
    { tienda: 'MotorMax', precio: 28300000 },
    { tienda: 'AutoParts Store', precio: 27800000 },
    { tienda: 'TiendaAuto', precio: 27950000 }
  ]},
  { id: 87, nombre: 'Toyota Hilux 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 29500000 },
    { tienda: 'MotorMax', precio: 29800000 },
    { tienda: 'AutoPlus', precio: 29300000 },
    { tienda: 'VehículosPro', precio: 29450000 }
  ]},
  { id: 88, nombre: 'Nissan Navara 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 30000000 },
    { tienda: 'MotorMax', precio: 30300000 },
    { tienda: 'AutoPlus', precio: 29800000 },
    { tienda: 'TiendaAuto', precio: 29950000 }
  ]},
  { id: 89, nombre: 'Volkswagen Amarok 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 31000000 },
    { tienda: 'MotorMax', precio: 31300000 },
    { tienda: 'AutoPlus', precio: 30800000 },
    { tienda: 'VehículosPro', precio: 30950000 }
  ]},
  { id: 90, nombre: 'Chevrolet Colorado 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 29500000 },
    { tienda: 'MotorMax', precio: 29800000 },
    { tienda: 'AutoPlus', precio: 29300000 },
    { tienda: 'TiendaAuto', precio: 29450000 }
  ]},
  { id: 91, nombre: 'Ford Ranger 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 30500000 },
    { tienda: 'MotorMax', precio: 30800000 },
    { tienda: 'AutoPlus', precio: 30300000 },
    { tienda: 'VehículosPro', precio: 30450000 }
  ]},
  { id: 92, nombre: 'Jeep Compass 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 27000000 },
    { tienda: 'MotorMax', precio: 27300000 },
    { tienda: 'AutoPlus', precio: 26800000 },
    { tienda: 'TiendaAuto', precio: 26950000 }
  ]},
  { id: 93, nombre: 'Renault Koleos 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 26000000 },
    { tienda: 'MotorMax', precio: 26300000 },
    { tienda: 'AutoPlus', precio: 25800000 },
    { tienda: 'VehículosPro', precio: 25950000 }
  ]},
  { id: 94, nombre: 'Peugeot 5008 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 28000000 },
    { tienda: 'MotorMax', precio: 28300000 },
    { tienda: 'AutoPlus', precio: 27800000 },
    { tienda: 'TiendaAuto', precio: 27950000 }
  ]},
  { id: 95, nombre: 'Toyota Corolla Cross 2024', categoria: 'autos', precios: [
    { tienda: 'AutoMundo', precio: 21500000 },
    { tienda: 'MotorMax', precio: 21800000 },
    { tienda: 'AutoPlus', precio: 21300000 },
    { tienda: 'VehículosPro', precio: 21450000 }
  ]},

  // === NUEVOS REPUESTOS (96-155) ===
  { id: 96, nombre: 'Filtro de Aire Universal', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 15000 },
    { tienda: 'AutoParts Store', precio: 14000 }
  ]},
  { id: 97, nombre: 'Aceite 10W40 (4L)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 23000 },
    { tienda: 'VehículosPro', precio: 22500 }
  ]},
  { id: 98, nombre: 'Batería 55Ah Libre Mantención', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 95000 },
    { tienda: 'RepuestosCL', precio: 92000 }
  ]},
  { id: 99, nombre: 'Pastillas de Freno Delanteras', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 47000 },
    { tienda: 'AutoMundo', precio: 50000 }
  ]},
  { id: 100, nombre: 'Pastillas de Freno Traseras', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 39000 },
    { tienda: 'RepuestosCL', precio: 38000 }
  ]},
  { id: 101, nombre: 'Discos de Freno (Par)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 75000 },
    { tienda: 'VehículosPro', precio: 71000 }
  ]},
  { id: 102, nombre: 'Aceite Sintético 5W20 (5L)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 28000 },
    { tienda: 'TiendaAuto', precio: 26500 }
  ]},
  { id: 103, nombre: 'Filtro de Cabina', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 18000 },
    { tienda: 'AutoMundo', precio: 18500 }
  ]},
  { id: 104, nombre: 'Amortiguador Delantero Izq.', categoria: 'repuestos', precios: [
    { tienda: 'VehículosPro', precio: 46000 },
    { tienda: 'TiendaAuto', precio: 45500 }
  ]},
  { id: 105, nombre: 'Amortiguador Delantero Der.', categoria: 'repuestos', precios: [
    { tienda: 'VehículosPro', precio: 46000 },
    { tienda: 'AutoParts Store', precio: 47000 }
  ]},
  { id: 106, nombre: 'Amortiguador Trasero (Par)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 85000 },
    { tienda: 'RepuestosCL', precio: 83000 }
  ]},
  { id: 107, nombre: 'Correa de Distribución', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 88000 },
    { tienda: 'TiendaAuto', precio: 86000 }
  ]},
  { id: 108, nombre: 'Bujías (Juego 4)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 32000 },
    { tienda: 'RepuestosCL', precio: 30000 }
  ]},
  { id: 109, nombre: 'Cable de Bujía (Juego)', categoria: 'repuestos', precios: [
    { tienda: 'VehículosPro', precio: 28000 },
    { tienda: 'AutoParts Store', precio: 25000 }
  ]},
  { id: 110, nombre: 'Bomba de Agua', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 57000 },
    { tienda: 'TiendaAuto', precio: 55000 }
  ]},
  { id: 111, nombre: 'Radiador Completo', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 82000 },
    { tienda: 'AutoPlus', precio: 79000 }
  ]},
  { id: 112, nombre: 'Alternador 12V', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 142000 },
    { tienda: 'VehículosPro', precio: 139000 }
  ]},
  { id: 113, nombre: 'Correa Serpentina', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 43000 },
    { tienda: 'RepuestosCL', precio: 41000 }
  ]},
  { id: 114, nombre: 'Juego de Pastillas & Discos', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 98000 },
    { tienda: 'TiendaAuto', precio: 95000 }
  ]},
  { id: 115, nombre: 'Sensor de Oxígeno', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 62000 },
    { tienda: 'AutoParts Store', precio: 61000 }
  ]},
  { id: 116, nombre: 'Filtro de Aceite', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 12000 },
    { tienda: 'VehículosPro', precio: 11800 }
  ]},
  { id: 117, nombre: 'Juego de Inyectores', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 152000 },
    { tienda: 'TiendaAuto', precio: 150000 }
  ]},
  { id: 118, nombre: 'Kit de Afinamiento Completo', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 90000 },
    { tienda: 'RepuestosCL', precio: 88000 }
  ]},
  { id: 119, nombre: 'Faros Halógeno (Juego)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 60000 },
    { tienda: 'AutoPlus', precio: 58000 }
  ]},
  { id: 120, nombre: 'Faros LED (Juego)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 95000 },
    { tienda: 'VehículosPro', precio: 93000 }
  ]},
  { id: 121, nombre: 'Llantas 15\" (Juego x4)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 220000 },
    { tienda: 'TiendaAuto', precio: 210000 }
  ]},
  { id: 122, nombre: 'Llantas 16\" (Juego x4)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 245000 },
    { tienda: 'RepuestosCL', precio: 235000 }
  ]},
  { id: 123, nombre: 'Bomba de Combustible', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 78000 },
    { tienda: 'VehículosPro', precio: 76000 }
  ]},
  { id: 124, nombre: 'Radiador de Aire Acondicionado', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 95000 },
    { tienda: 'AutoParts Store', precio: 92000 }
  ]},
  { id: 125, nombre: 'Compresor A/A', categoria: 'repuestos', precios: [
    { tienda: 'VehículosPro', precio: 185000 },
    { tienda: 'AutoPlus', precio: 182000 }
  ]},
  { id: 126, nombre: 'Amortiguador Trasero Izq.', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 90000 },
    { tienda: 'RepuestosCL', precio: 88000 }
  ]},
  { id: 127, nombre: 'Amortiguador Trasero Der.', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 90000 },
    { tienda: 'AutoParts Store', precio: 92000 }
  ]},
  { id: 128, nombre: 'Espejo Lateral Izq.', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 24000 },
    { tienda: 'AutoPlus', precio: 23000 }
  ]},
  { id: 129, nombre: 'Espejo Lateral Der.', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 24000 },
    { tienda: 'RepuestosCL', precio: 23500 }
  ]},
  { id: 130, nombre: 'Manillas de Puerta (Juego 4)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 18000 },
    { tienda: 'AutoMundo', precio: 17500 }
  ]},
  { id: 131, nombre: 'Interruptor Ventana Eléctrica', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 15000 },
    { tienda: 'VehículosPro', precio: 14500 }
  ]},
  { id: 132, nombre: 'Sensor de Presión de Neumáticos', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 35000 },
    { tienda: 'AutoParts Store', precio: 34000 }
  ]},
  { id: 133, nombre: 'Bomba de Agua Eléctrica', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 65000 },
    { tienda: 'RepuestosCL', precio: 63000 }
  ]},
  { id: 134, nombre: 'Termostato Motor', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 22000 },
    { tienda: 'TiendaAuto', precio: 21000 }
  ]},
  { id: 135, nombre: 'Correa de Distribución Premium', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 92000 },
    { tienda: 'VehículosPro', precio: 90000 }
  ]},
  { id: 136, nombre: 'Bujías Iridio (Juego 4)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 42000 },
    { tienda: 'AutoParts Store', precio: 40000 }
  ]},
  { id: 137, nombre: 'Filtro de Cabina Carbono', categoria: 'repuestos', precios: [
    { tienda: 'RepuestosCL', precio: 21000 },
    { tienda: 'AutoPlus', precio: 20000 }
  ]},
  { id: 138, nombre: 'Bombín de Freno Delantero', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 34000 },
    { tienda: 'TiendaAuto', precio: 33000 }
  ]},
  { id: 139, nombre: 'Bombín de Freno Trasero', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 33000 },
    { tienda: 'AutoParts Store', precio: 32000 }
  ]},
  { id: 140, nombre: 'Kit de Correas (Alternador + Aire)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 56000 },
    { tienda: 'VehículosPro', precio: 54000 }
  ]},
  { id: 141, nombre: 'Líquido de Frenos 1L', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 9500 },
    { tienda: 'RepuestosCL', precio: 9000 }
  ]},
  { id: 142, nombre: 'Líquido de Dirección Hidráulica 1L', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 13500 },
    { tienda: 'AutoParts Store', precio: 13000 }
  ]},
  { id: 143, nombre: 'Amortiguador De Techo (Monovolume)', categoria: 'repuestos', precios: [
    { tienda: 'TiendaAuto', precio: 76000 },
    { tienda: 'RepuestosCL', precio: 74500 }
  ]},
  { id: 144, nombre: 'Bomba de Freno Trasera', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 41000 },
    { tienda: 'AutoParts Store', precio: 40000 }
  ]},
  { id: 145, nombre: 'Porta-placa Trasero', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 15000 },
    { tienda: 'TiendaAuto', precio: 14500 }
  ]},
  { id: 146, nombre: 'Luz de Stop Trasera (Par)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 22000 },
    { tienda: 'RepuestosCL', precio: 21000 }
  ]},
  { id: 147, nombre: 'Luz de Giro Delantera (Par)', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 18000 },
    { tienda: 'TiendaAuto', precio: 17000 }
  ]},
  { id: 148, nombre: 'Limpiaparabrisas Delanteros', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 26000 },
    { tienda: 'RepuestosCL', precio: 25500 }
  ]},
  { id: 149, nombre: 'Tapiz Interior Completo', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 150000 },
    { tienda: 'VehículosPro', precio: 145000 }
  ]},
  { id: 150, nombre: 'Alfombras Universales (Juego 4)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 35000 },
    { tienda: 'TiendaAuto', precio: 34000 }
  ]},
  { id: 151, nombre: 'Cinturones de Seguridad (Juego 5)', categoria: 'repuestos', precios: [
    { tienda: 'AutoPlus', precio: 48000 },
    { tienda: 'RepuestosCL', precio: 46000 }
  ]},
  { id: 152, nombre: 'Kit de Embrague Completo', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 99000 },
    { tienda: 'AutoParts Store', precio: 96500 }
  ]},
  { id: 153, nombre: 'Radiador de Aceite', categoria: 'repuestos', precios: [
    { tienda: 'VehículosPro', precio: 67000 },
    { tienda: 'AutoPlus', precio: 65000 }
  ]},
  { id: 154, nombre: 'Filtro de Combustible', categoria: 'repuestos', precios: [
    { tienda: 'AutoMundo', precio: 12000 },
    { tienda: 'RepuestosCL', precio: 11500 }
  ]},
  { id: 155, nombre: 'Bomba de Vacío (Dirección)', categoria: 'repuestos', precios: [
    { tienda: 'AutoParts Store', precio: 88000 },
    { tienda: 'TiendaAuto', precio: 86000 }
  ]}
];

// ==================== DARK MODE ====================
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  guardarLocalStorage('darkMode', isDarkMode ? 'true' : 'false');
  actualizarBotonDarkMode();
}

function actualizarBotonDarkMode() {
  const btnDarkMode = document.getElementById('btn-dark-mode');
  if (!btnDarkMode) return;
  
  const isDarkMode = document.body.classList.contains('dark-mode');
  
 if (isDarkMode) {
    btnDarkMode.innerHTML = '<i class="bi bi-sun-fill"></i> Light';
    btnDarkMode.classList.remove('btn-outline-light');
    btnDarkMode.classList.add('btn-warning');
} else {
    btnDarkMode.innerHTML = '<i class="bi bi-moon-stars"></i> Dark';
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


// ==================== ALMACENAMIENTO LOCAL ====================
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

// ==================== FUNCIONES DE UTILIDAD ====================
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(precio);
}

function normalizarBusqueda(texto) {
  return texto.toLowerCase().trim().replace(/\s+/g, ' ');
}

function debounce(func, delay) {
  return function(...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func(...args), delay);
  };
}

// ==================== HISTORIAL ====================
function cargarHistorial() {
  try {
    const historialGuardado = obtenerLocalStorage('historialBusquedas');
    historialBusquedas = historialGuardado ? JSON.parse(historialGuardado) : [];
  } catch (e) {
    console.warn('Error al cargar historial:', e.message);
    historialBusquedas = [];
  }
}

function guardarHistorial() {
  guardarLocalStorage('historialBusquedas', JSON.stringify(historialBusquedas));
}

function agregarAlHistorial(termino) {
  const terminoNormalizado = normalizarBusqueda(termino);
  if (!terminoNormalizado) return;
  
  const indice = historialBusquedas.indexOf(terminoNormalizado);
  if (indice > -1) {
    historialBusquedas.splice(indice, 1);
  }
  
  historialBusquedas.unshift(terminoNormalizado);
  if (historialBusquedas.length > CONFIG.maxHistorial) {
    historialBusquedas.pop();
  }
  
  guardarHistorial();
  actualizarHistorial();
}

function actualizarHistorial() {
  const historialItems = document.getElementById('historial-items');
  if (!historialItems) return;
  
  if (historialBusquedas.length === 0) {
    historialItems.innerHTML = '<span class="text-muted">Sin búsquedas recientes</span>';
    return;
  }
  
  historialItems.innerHTML = historialBusquedas
    .map(item => `<a href="#" onclick="buscarPorHistorial('${item}'); return false;" class="badge bg-primary ms-1">${item}</a>`)
    .join('');
}

function buscarPorHistorial(term) {
  const inputBusqueda = document.getElementById('busqueda');
  if (inputBusqueda) {
    inputBusqueda.value = term;
    buscarProducto();
  }
}

// ==================== SUGERENCIAS ====================
function actualizarSugerencias(texto) {
  const input = normalizarBusqueda(texto);
  const datalist = document.getElementById('sugerencias-lista');
  
  if (!datalist) return;
  
  datalist.innerHTML = '';
  if (input.length < 2) return;

  const sugerencias = productos
    .filter(p => p.nombre.toLowerCase().includes(input))
    .slice(0, 8)
    .map(p => p.nombre);

  sugerencias.forEach(sugerencia => {
    const option = document.createElement('option');
    option.value = sugerencia;
    datalist.appendChild(option);
  });
}

// ==================== BÚSQUEDA ====================
function buscarProducto() {
  const inputBusqueda = document.getElementById('busqueda');
  const selectCategoria = document.getElementById('categoria');
  
  if (!inputBusqueda || !selectCategoria) return;
  
  const busqueda = normalizarBusqueda(inputBusqueda.value);
  const categoria = selectCategoria.value;

  if (!busqueda && categoria === 'todos') {
    mostrarMensaje('Por favor, ingresa un término de búsqueda o selecciona una categoría.');
    return;
  }

  if (busqueda) {
    agregarAlHistorial(busqueda);
  }

  let resultados = productos.filter(producto => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
    const coincideCategoria = categoria === 'todos' || producto.categoria === categoria;
    return busqueda === '' ? coincideCategoria : coincideNombre && coincideCategoria;
  });

  if (resultados.length === 0) {
    mostrarMensaje('No se encontraron productos que coincidan con tu búsqueda.');
    return;
  }

  // ========== MEJORA 1: Eliminar duplicados por ID ==========
  resultados = resultados.filter(
    (prod, index, self) => index === self.findIndex(p => p.id === prod.id)
  );

  resultados = resultados.map(producto => {
    const precios = producto.precios.map(p => p.precio);
    const precioMinimo = Math.min(...precios);
    const precioMaximo = Math.max(...precios);
    return {
      ...producto,
      precioMinimo,
      precioMaximo,
      ahorroTotal: precioMaximo - precioMinimo,
      porcentajeAhorro: Math.round((precioMaximo - precioMinimo) / precioMaximo * 100)
    };
  });

  resultadosActuales = resultados;
  paginaActual = 1;
  aplicarFiltros();
  mostrarResumenBusqueda(resultados, categoria);
  mostrarOfertas();
  mostrarRatingTiendas();
  mostrarEstadisticas(resultados);
}

// ==================== FILTROS ====================
function aplicarFiltros() {
  const ordenarPor = document.getElementById('ordenar-por');
  if (!ordenarPor) return;
  
  const ordenarPorValue = ordenarPor.value;
  let resultados = [...resultadosActuales];

  switch(ordenarPorValue) {
    case 'mayor-ahorro':
      resultados.sort((a, b) => b.ahorroTotal - a.ahorroTotal);
      break;
    case 'menor-precio':
      resultados.sort((a, b) => a.precioMinimo - b.precioMinimo);
      break;
    case 'mayor-precio':
      resultados.sort((a, b) => b.precioMaximo - a.precioMaximo);
      break;
    default:
      break;
  }

  mostrarResultados(resultados);
  
}




function limpiarFiltros() {
  const ordenarPor = document.getElementById('ordenar-por');
  if (ordenarPor) {
    ordenarPor.value = 'relevancia';
    aplicarFiltros();
  }
}

// ==================== MOSTRAR RESULTADOS ====================
function mostrarResultados(resultados) {
  const tablaResultados = document.getElementById('tabla-resultados');
  if (!tablaResultados) return;
  
  tablaResultados.innerHTML = '';

  const inicio = (paginaActual - 1) * CONFIG.itemsPorPagina;
  const fin = inicio + CONFIG.itemsPorPagina;
  const resultadosPagina = resultados.slice(inicio, fin);

  resultadosPagina.forEach((producto, index) => {
    const preciosOrdenados = [...producto.precios].sort((a, b) => a.precio - b.precio);
    const mejorPrecio = preciosOrdenados[0];

    const fila = document.createElement('tr');
    fila.className = 'producto-principal';
    const filId = `producto-${producto.id}-${index}`;
    
    fila.innerHTML = `
      <td colspan="3" class="p-0">
        <div class="producto-header">
          <div class="producto-info">
            <button class="btn-expandir" onclick="toggleDetalles('${filId}', this)" type="button">
              <i class="bi bi-chevron-down"></i>
            </button>
            <div>
              <h5 class="mb-0">${producto.nombre}</h5>
              <small class="text-muted">Rango: ${formatearPrecio(producto.precioMinimo)} - ${formatearPrecio(producto.precioMaximo)}</small>
            </div>
          </div>
          <div class="producto-ahorro">
            <div class="ahorro-box">
              <span class="ahorro-label">💰 Mejor precio</span>
              <span class="ahorro-cantidad">${formatearPrecio(mejorPrecio.precio)}</span>
              <small class="ahorro-porcentaje">Ahorras ${formatearPrecio(producto.ahorroTotal)}</small>
            </div>
          </div>
        </div>
        <div id="${filId}" class="detalles-expandible" style="display: none;">
          <div class="comparativa-precios">
            ${preciosOrdenados.map((p, idx) => {
              const diferencia = p.precio - producto.precioMinimo;
              const mejorPrecioClase = idx === 0 ? 'mejor-precio-destacado' : '';
              return `
                <div class="precio-item ${mejorPrecioClase}">
                  <div class="tienda-nombre">${p.tienda}</div>
                  <div class="tienda-precio">${formatearPrecio(p.precio)}</div>
                  ${idx === 0 ? '<div class="badge-mejor">✓ MEJOR PRECIO</div>' : `<div class="diferencia-precio">${formatearPrecio(diferencia)} más caro</div>`}
                </div>
              `;
            }).join('')}
          </div>
          <div class="detalles-expandidos">
            ${generarDetallesExpandidos(producto, preciosOrdenados)}
          </div>
        </div>
      </td>
    `;
    tablaResultados.appendChild(fila);
  });

  generarPaginacion(resultados.length);
}

function generarPaginacion(total) {
  const totalPaginas = Math.ceil(total / CONFIG.itemsPorPagina);
  const paginacionContainer = document.getElementById('paginacion-container');
  const paginacion = document.getElementById('paginacion');

  if (!paginacionContainer || !paginacion) return;

  if (totalPaginas <= 1) {
    paginacionContainer.style.display = 'none';
    return;
  }

  paginacionContainer.style.display = 'block';
  paginacion.innerHTML = '';

  // Botón anterior
  const liAnterior = document.createElement('li');
  liAnterior.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
  liAnterior.innerHTML = `
    <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual - 1}); return false;">
      <i class="bi bi-chevron-left"></i>
    </a>
  `;
  paginacion.appendChild(liAnterior);

  // Números de página
  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
    li.innerHTML = `
      <a class="page-link" href="#" onclick="cambiarPagina(${i}); return false;">${i}</a>
    `;
    paginacion.appendChild(li);
  }

  // Botón siguiente
  const liSiguiente = document.createElement('li');
  liSiguiente.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
  liSiguiente.innerHTML = `
    <a class="page-link" href="#" onclick="cambiarPagina(${paginaActual + 1}); return false;">
      <i class="bi bi-chevron-right"></i>
    </a>
  `;
  paginacion.appendChild(liSiguiente);
}

function cambiarPagina(pagina) {
  const totalPaginas = Math.ceil(resultadosActuales.length / CONFIG.itemsPorPagina);
  
  if (pagina < 1 || pagina > totalPaginas) return;
  
  paginaActual = pagina;
  aplicarFiltros();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleDetalles(id, botonElem) {
  const elemento = document.getElementById(id);
  if (!elemento) return;
  
  const boton = botonElem || document.querySelector(`[onclick*="${id}"]`);
  if (!boton) return;

  const estaExpandido = elemento.style.display !== 'none';
  
  if (estaExpandido) {
    elemento.style.display = 'none';
    boton.classList.remove('expandido');
  } else {
    elemento.style.display = 'block';
    boton.classList.add('expandido');
  }
}

function generarDetallesExpandidos(producto, preciosOrdenados) {
  const precios = producto.precios.map(p => p.precio);
  const precioPromedio = precios.reduce((a, b) => a + b) / precios.length;
  const mejorOpcion = preciosOrdenados[0];
  const peorOpcion = preciosOrdenados[preciosOrdenados.length - 1];

  return `
    <div class="estadisticas-expandidas">
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-label">📊 Precio Promedio</span>
          <span class="stat-valor">${formatearPrecio(precioPromedio)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">🏆 Mejor Opción</span>
          <span class="stat-valor">${mejorOpcion.tienda}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">⚠️ Más Caro</span>
          <span class="stat-valor">${peorOpcion.tienda}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">💵 Diferencia</span>
          <span class="stat-valor">${formatearPrecio(peorOpcion.precio - mejorOpcion.precio)}</span>
        </div>
      </div>
      <div class="recomendacion-expandida">
        <p>💡 <strong>Recomendación:</strong> Compra en <strong>${mejorOpcion.tienda}</strong> por ${formatearPrecio(mejorOpcion.precio)} y ahorra <strong>${formatearPrecio(producto.ahorroTotal)}</strong>.</p>
      </div>
    </div>
  `;
}

// ==================== RESUMEN DE BÚSQUEDA ====================
function mostrarResumenBusqueda(resultados, categoria) {
  const contenedor = document.querySelector('.table-responsive');
  if (!contenedor) return;

  let totalAhorroMaximo = 0;
  let productoMayorAhorro = null;

  resultados.forEach(p => {
    totalAhorroMaximo += p.ahorroTotal;
    if (!productoMayorAhorro || p.ahorroTotal > productoMayorAhorro.ahorroTotal) {
      productoMayorAhorro = p;
    }
  });

  const categoriaTexto = categoria === 'todos' ? 'productos' : categoria;
  const resumen = `
    <div class="resumen-busqueda">
      <div class="resumen-item">
        <i class="bi bi-box"></i>
        <div>
          <strong>${resultados.length}</strong>
          <span>${categoriaTexto} encontrados</span>
        </div>
      </div>
      <div class="resumen-item">
        <i class="bi bi-piggy-bank"></i>
        <div>
          <strong>${formatearPrecio(totalAhorroMaximo)}</strong>
          <span>Ahorro total posible</span>
        </div>
      </div>
      <div class="resumen-item">
        <i class="bi bi-award"></i>
        <div>
          <strong>${productoMayorAhorro ? productoMayorAhorro.nombre.substring(0, 20) + '...' : '—'}</strong>
          <span>Mayor ahorro: ${productoMayorAhorro ? formatearPrecio(productoMayorAhorro.ahorroTotal) : '—'}</span>
        </div>
      </div>
    </div>
  `;

  const elementoExistente = document.querySelector('.resumen-busqueda');
  if (elementoExistente) {
    elementoExistente.remove();
  }

  contenedor.insertAdjacentHTML('beforebegin', resumen);
}

// ==================== MENSAJES ====================
function mostrarMensaje(mensaje) {
  const tablaResultados = document.getElementById('tabla-resultados');
  if (!tablaResultados) return;
  
  tablaResultados.innerHTML = `
    <tr>
      <td colspan="3">
        <div class="alert alert-info text-center mb-0" role="alert">
          <i class="bi bi-info-circle"></i> ${mensaje}
        </div>
      </td>
    </tr>
  `;
}

// ==================== OFERTAS ====================
function mostrarOfertas() {
  const ofertas = productos
    .map(p => ({
      ...p,
      precioMin: Math.min(...p.precios.map(pr => pr.precio)),
      precioMax: Math.max(...p.precios.map(pr => pr.precio)),
      ahorro: Math.max(...p.precios.map(pr => pr.precio)) - Math.min(...p.precios.map(pr => pr.precio))
    }))
    .sort((a, b) => b.ahorro - a.ahorro)
    .slice(0, 3);

  const container = document.getElementById('ofertas-container');
  if (!container) return;
  
  container.innerHTML = ofertas.map(oferta => {
    const mejorTienda = oferta.precios.find(p => p.precio === oferta.precioMin);
    return `
      <div class="col-md-4">
        <div class="oferta-card">
          <div class="oferta-ahorro">
            Ahorra ${formatearPrecio(oferta.ahorro)}
          </div>
          <h6>${oferta.nombre}</h6>
          <p class="oferta-precio">${formatearPrecio(oferta.precioMin)}</p>
          <small class="text-muted">En ${mejorTienda.tienda}</small>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== RATING DE TIENDAS ====================
function mostrarRatingTiendas() {
  const container = document.getElementById('tiendas-container');
  if (!container) return;
  
  const tiendas = Object.entries(ratingTiendas).sort((a, b) => b[1].stars - a[1].stars);

  container.innerHTML = tiendas.map(([tienda, data]) => {
    const estrellas = Math.floor(data.stars);
    const tieneMedio = data.stars % 1 !== 0;
    const stars = '⭐'.repeat(estrellas) + (tieneMedio ? '✨' : '');
    
    return `
      <div class="col-md-6 col-lg-4">
        <div class="tienda-card">
          <h6>${tienda}</h6>
          <div class="tienda-rating">
            <span class="stars">${stars}</span>
            <span class="rating-text">${data.stars}/5</span>
          </div>
          <small class="text-muted">${data.reviews} reseñas</small>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== ESTADÍSTICAS ====================
function mostrarEstadisticas(resultados) {
  if (resultados.length === 0) return;

  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚗 COMPARADOR DE PRECIOS SOLOCARS - ANÁLISIS DETALLADO`);
  console.log(`${'='.repeat(60)}\n`);

  console.log(`📊 RESUMEN GENERAL:`);
  console.log(`   • Productos analizados: ${resultados.length}`);

  let totalAhorroMaximo = 0;
  let precioGlobalMinimo = Infinity;
  let precioGlobalMaximo = 0;

  resultados.forEach(producto => {
    const precios = producto.precios.map(p => p.precio);
    const minimo = Math.min(...precios);
    const maximo = Math.max(...precios);
    const promedio = precios.reduce((a, b) => a + b) / precios.length;
    const ahorro = maximo - minimo;

    totalAhorroMaximo += ahorro;
    precioGlobalMinimo = Math.min(precioGlobalMinimo, minimo);
    precioGlobalMaximo = Math.max(precioGlobalMaximo, maximo);

    console.log(`\n   📦 ${producto.nombre}`);
    console.log(`      • Mín: ${formatearPrecio(minimo)} | Máx: ${formatearPrecio(maximo)} | Prom: ${formatearPrecio(promedio)}`);
    console.log(`      • 💰 Ahorro: ${formatearPrecio(ahorro)} (${producto.porcentajeAhorro}%)`);

    const mejorPrecio = producto.precios.reduce((a, b) => a.precio < b.precio ? a : b);
    console.log(`      • 🏆 Mejor precio en: ${mejorPrecio.tienda} (${formatearPrecio(mejorPrecio.precio)})`);
  });

  console.log(`\n${'='.repeat(60)}`);
  console.log(`💵 TOTALES:`);
  console.log(`   • Ahorro total máximo posible: ${formatearPrecio(totalAhorroMaximo)}`);
  console.log(`   • Rango de precios global: ${formatearPrecio(precioGlobalMinimo)} - ${formatearPrecio(precioGlobalMaximo)}`);
  console.log(`${'='.repeat(60)}\n`);
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
  const inputBusqueda = document.getElementById('busqueda');
  const selectCategoria = document.getElementById('categoria');

  cargarHistorial();
  // corregir la llamada a toggle dark mode label (evita posible error si icono cambió)
  try { actualizarBotonDarkMode(); } catch(e) {}

  if (inputBusqueda) {
    inputBusqueda.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        buscarProducto();
      }
    });

    inputBusqueda.addEventListener('input', debounce(function(e) {
      actualizarSugerencias(e.target.value);
    }, CONFIG.debounceDelay));
  }

  if (selectCategoria) {
    selectCategoria.addEventListener('change', function() {
      if ((inputBusqueda && inputBusqueda.value.trim() !== '') || selectCategoria.value !== 'todos') {
        buscarProducto();
      }
    });
  }

  actualizarHistorial();
  console.log('🚗 SoloCars v4.0 - Script cargado con PASO 2 y PASO 3 integrados');
});


// ==================== ANUNCIOS ROTATIVOS ====================

const anuncios = [
  "🔥 AutoMundo - Descuentos hasta 30% esta semana",
  "🔧 RepuestosCL - Envíos gratis sobre $50.000",
  "💥 MotorMax - Ofertas especiales en baterías y frenos",
  "🚗 AutoPlus - Nuevos modelos 2025 en promoción",
  "🏁 VehículosPro - Los mejores precios del mercado",
  "🛠️ AutoParts Store - Repuestos garantizados"
  
];

let anuncioIndex = 0;

function rotarAnuncios() {
  const contenedor = document.getElementById("anuncio-rotativo");
  if (!contenedor) return;

  contenedor.style.opacity = "0";
  
  setTimeout(() => {
    contenedor.textContent = anuncios[anuncioIndex];
    contenedor.style.opacity = "1";
    anuncioIndex = (anuncioIndex + 1) % anuncios.length;
  }, 400);
}

// Rotar cada 4 segundos
setInterval(rotarAnuncios, 4000);

// Mostrar primer anuncio al inicio
document.addEventListener("DOMContentLoaded", rotarAnuncios);



