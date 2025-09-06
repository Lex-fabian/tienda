<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ClienteComponent from '@/components/ClienteComponent.vue';
import VendedorComponent from '@/components/VendedorComponent.vue';
import VentaComponent from '@/components/VentaComponent.vue';
import ZonaComponent from '@/components/ZonaComponent.vue';
import ProductoComponent from '@/components/ProductoComponent.vue';
import ReportesComponent from '@/components/ReportesComponent.vue';
import './style/inicio.css';
import { ventaApi } from './services/apiService';

const router = useRouter();
const menuActivo = ref('inicio');
const dashboardData = ref(null);
const cargandoDashboard = ref(true);

const cambiarMenu = (menu) => {
  menuActivo.value = menu;
};

const cargarDashboard = async () => {
  try {
    cargandoDashboard.value = true;
    dashboardData.value = await ventaApi.getDashboardData();
  } catch (error) {
    console.error("Error al cargar el dashboard:", error);
  } finally {
    cargandoDashboard.value = false;
  }
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
};

onMounted(cargarDashboard);
</script>

<template>
  <div class="contenido-inicio">
    <header class="inicio-header">
      <h1>Sistema de Gestión de Ventas</h1>
      <button class="logout-button" @click="logout">Cerrar Sesión</button>
    </header>

    <nav class="menu-navegacion">
      <ul class="menu-lista">
        <li>
          <button 
            :class="['menu-item', { active: menuActivo === 'inicio' }]"
            @click="cambiarMenu('inicio')"
          >
            Inicio
          </button>
        </li>
        <li>
          <button 
            :class="['menu-item', { active: menuActivo === 'clientes' }]"
            @click="cambiarMenu('clientes')"
          >
            Clientes
          </button>
        </li>
        <li>
          <button 
            :class="['menu-item', { active: menuActivo === 'vendedores' }]"
            @click="cambiarMenu('vendedores')"
          >
            Vendedores
          </button>
        </li>
        <li>
          <button 
            :class="['menu-item', { active: menuActivo === 'ventas' }]"
            @click="cambiarMenu('ventas')"
          >
            Ventas
          </button>
        </li>
        <li>
          <button 
            :class="['menu-item', { active: menuActivo === 'zonas' }]"
            @click="cambiarMenu('zonas')"
          >
            Zonas
          </button>
        </li>
        <li>
          <button 
            :class="['menu-item', { active: menuActivo === 'productos' }]"
            @click="cambiarMenu('productos')"
          >
            Productos
          </button>
        </li>
        <li>
          <button 
            :class="['menu-item', { active: menuActivo === 'reportes' }]"
            @click="cambiarMenu('reportes')"
          >
            Reportes
          </button>
        </li>
      </ul>
    </nav>

    <main class="inicio-cuerpo">
      <h2 v-if="menuActivo === 'inicio'">Dashboard Principal</h2>
      <h2 v-else-if="menuActivo === 'clientes'">Gestión de Clientes</h2>
      <h2 v-else-if="menuActivo === 'vendedores'">Gestión de Vendedores</h2>
      <h2 v-else-if="menuActivo === 'ventas'">Gestión de Ventas</h2>
      <h2 v-else-if="menuActivo === 'zonas'">Gestión de Zonas</h2>
      <h2 v-else-if="menuActivo === 'productos'">Gestión de Productos</h2>
      <h2 v-else-if="menuActivo === 'reportes'">Reportes de Ventas</h2>
      
      <ClienteComponent v-if="menuActivo === 'clientes'" />
      <VendedorComponent v-else-if="menuActivo === 'vendedores'" />
      <VentaComponent v-else-if="menuActivo === 'ventas'" />
      <ZonaComponent v-else-if="menuActivo === 'zonas'" />
      <ProductoComponent v-else-if="menuActivo === 'productos'" />
      <ReportesComponent v-else-if="menuActivo === 'reportes'" />
      
      <div v-if="menuActivo === 'inicio'">
        <div v-if="cargandoDashboard" class="cargando">
          <p>Cargando datos del dashboard...</p>
        </div>
        <div v-else-if="dashboardData" class="dashboard-grid">
          <div class="dashboard-card">
            <div class="info">
              <h4>Total Clientes</h4>
              <p>{{ dashboardData.total_clientes }}</p>
            </div>
          </div>
          <div class="dashboard-card">
            <div class="info">
              <h4>Total Ventas</h4>
              <p>{{ dashboardData.total_ventas }}</p>
            </div>
          </div>
          <div class="dashboard-card">
            <div class="info">
              <h4>Total Vendedores</h4>
              <p>{{ dashboardData.total_vendedores }}</p>
            </div>
          </div>
          <div class="dashboard-card">
            <div class="info">
              <h4>Total Productos</h4>
              <p>{{ dashboardData.total_productos }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>