<script setup>
import { onMounted, reactive } from 'vue';
import { ventaApi } from '../services/apiService';
import '../style/reportes.css';

const cargando = reactive({
  zonasPorVendedor: true,
  ventasAnuales: true,
  zonasSinVentas: false,
  vendedoresSinVentas: false,
});

const reportes = reactive({
  zonasPorVendedor: [],
  ventasAnuales: [],
  zonasSinVentas: [],
  vendedoresSinVentas: [],
});

const errores = reactive({
  zonasPorVendedor: '',
  ventasAnuales: '',
  zonasSinVentas: '',
  vendedoresSinVentas: '',
});

const filtros = reactive({
  zonas: { inicio: '', fin: '' },
  vendedores: { inicio: '', fin: '' },
});

const cargarReportesIniciales = async () => {
  try {
    errores.zonasPorVendedor = '';
    errores.ventasAnuales = '';
    const [zonasData, anualesData] = await Promise.all([
      ventaApi.getZonasPorVendedor(),
      ventaApi.getVentasAnualesCliente(),
    ]);
    reportes.zonasPorVendedor = zonasData;
    reportes.ventasAnuales = anualesData;
  } catch (error) {
    const mensajeError = error.message || 'Error al cargar los reportes iniciales';
    errores.zonasPorVendedor = mensajeError;
    errores.ventasAnuales = mensajeError;
  } finally {
    cargando.zonasPorVendedor = false;
    cargando.ventasAnuales = false;
  }
};

const generarReporteZonasSinVentas = async () => {
  generarReporte(
    'zonasSinVentas',
    ventaApi.getZonasSinVentas,
    filtros.zonas,
    'Seleccione un rango de fechas'
  );
};

const generarReporteVendedoresSinVentas = async () => {
  generarReporte(
    'vendedoresSinVentas',
    ventaApi.getVendedoresSinVentas,
    filtros.vendedores,
    'Seleccione un rango de fechas'
  );
};

const generarReporte = async (nombreReporte, apiFn, filtro, mensajeErrorFiltro) => {
  if (!filtro.inicio || !filtro.fin) {
    errores[nombreReporte] = mensajeErrorFiltro;
    return;
  }
  try {
    cargando[nombreReporte] = true;
    errores[nombreReporte] = '';
    reportes[nombreReporte] = await apiFn(filtro);
  } catch (error) {
    errores[nombreReporte] = error.message || `Error al generar el reporte`;
  } finally {
    cargando[nombreReporte] = false;
  }
};

onMounted(cargarReportesIniciales);
</script>

<template>
  <div class="reportes-container">
    <div class="reporte-card">
      <h3>Zonas con Mayor Venta por Vendedor</h3>
      <div v-if="cargando.zonasPorVendedor" class="cargando-reporte">Cargando...</div>
      <p v-else-if="errores.zonasPorVendedor" class="error-message">{{ errores.zonasPorVendedor }}</p>
      <div v-else-if="reportes.zonasPorVendedor.length > 0" class="tabla-contenedor">
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>Vendedor</th>
              <th>Zona</th>
              <th>Total Ventas (Cantidad)</th>
              <th>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in reportes.zonasPorVendedor" :key="`${item.nombre_vendedor}-${item.nombre_zona}`">
              <td>{{ item.nombre_vendedor }}</td>
              <td>{{ item.nombre_zona }}</td>
              <td>{{ item.total_ventas }}</td>
              <td>${{ parseFloat(item.monto_total).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="no-data">No hay datos para mostrar.</p>
    </div>

    <div class="reporte-card">
      <h3>Ventas Anuales por Cliente</h3>
      <div v-if="cargando.ventasAnuales" class="cargando-reporte">Cargando...</div>
      <p v-else-if="errores.ventasAnuales" class="error-message">{{ errores.ventasAnuales }}</p>
      <div v-else-if="reportes.ventasAnuales.length > 0" class="tabla-contenedor">
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Zona</th>
              <th>Ventas 2020</th>
              <th>Ventas 2021</th>
              <th>Ventas 2022</th>
              <th>Ventas 2023</th>
              <th>Ventas 2024</th>
              <th>Ventas 2025</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in reportes.ventasAnuales" :key="item.nombre_cliente">
              <td>{{ item.nombre_cliente }}</td>
              <td>{{ item.nombre_zona || 'N/A' }}</td>
              <td>${{ parseFloat(item.ventas_2020).toFixed(2) }}</td>
              <td>${{ parseFloat(item.ventas_2021).toFixed(2) }}</td>
              <td>${{ parseFloat(item.ventas_2022).toFixed(2) }}</td>
              <td>${{ parseFloat(item.ventas_2023).toFixed(2) }}</td>
              <td>${{ parseFloat(item.ventas_2024).toFixed(2) }}</td>
              <td>${{ parseFloat(item.ventas_2025).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="no-data">No hay datos para mostrar.</p>
    </div>

    <div class="reporte-card">
      <h3>Zonas Sin Ventas por Rango de Fechas</h3>
      <div class="form-filtros">
        <input type="date" v-model="filtros.zonas.inicio" />
        <input type="date" v-model="filtros.zonas.fin" />
        <button @click="generarReporteZonasSinVentas" :disabled="cargando.zonasSinVentas">
          {{ cargando.zonasSinVentas ? 'Generando...' : 'Generar' }}
        </button>
      </div>
      <div v-if="cargando.zonasSinVentas" class="cargando-reporte">Generando reporte...</div>
      <p v-else-if="errores.zonasSinVentas" class="error-message">{{ errores.zonasSinVentas }}</p>
      <div v-else-if="reportes.zonasSinVentas.length > 0" class="tabla-contenedor">
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(zona, index) in reportes.zonasSinVentas" :key="zona.id_zona">
              <td>{{ index + 1 }}</td>
              <td>{{ zona.nombre_zona }}</td>
              <td>{{ zona.descripcion }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="no-data">Seleccione un rango de fechas y genere el reporte.</p>
    </div>

    <div class="reporte-card">
      <h3>Vendedores Sin Ventas por Rango de Fechas</h3>
      <div class="form-filtros">
        <input type="date" v-model="filtros.vendedores.inicio" />
        <input type="date" v-model="filtros.vendedores.fin" />
        <button @click="generarReporteVendedoresSinVentas" :disabled="cargando.vendedoresSinVentas">
          {{ cargando.vendedoresSinVentas ? 'Generando...' : 'Generar' }}
        </button>
      </div>
      <div v-if="cargando.vendedoresSinVentas" class="cargando-reporte">Generando reporte...</div>
      <p v-else-if="errores.vendedoresSinVentas" class="error-message">{{ errores.vendedoresSinVentas }}</p>
      <div v-else-if="reportes.vendedoresSinVentas.length > 0" class="tabla-contenedor">
        <table class="tabla-reporte">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vendedor, index) in reportes.vendedoresSinVentas" :key="vendedor.id_vendedor">
              <td>{{ index + 1 }}</td>
              <td>{{ vendedor.nombre }} {{ vendedor.apellido }}</td>
              <td>{{ vendedor.email }}</td>
              <td>{{ vendedor.telefono }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="no-data">Seleccione un rango de fechas y genere el reporte.</p>
    </div>
  </div>
</template>