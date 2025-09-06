<script setup>
import { ref, onMounted, reactive } from 'vue';
import { zonaApi } from '../services/apiService';
import '../style/zona.css';

const zonas = ref([]);
const cargando = ref(true);
const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const zonaEditando = ref(null);
const errores = ref({});
const mensajeErrorApi = ref('');

const nuevaZona = reactive({
  nombre_zona: '',
  descripcion: '',
  referencia: ''
});

const validarFormulario = () => {
  errores.value = {};
  if (!nuevaZona.nombre_zona.trim()) {
    errores.value.nombre_zona = 'El nombre de la zona es obligatorio';
  }
  return Object.keys(errores.value).length === 0;
};

const cargarZonas = async () => {
  try {
    cargando.value = true;
    mensajeErrorApi.value = '';
    zonas.value = await zonaApi.getAll();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al cargar las zonas';
  } finally {
    cargando.value = false;
  }
};

const abrirFormulario = (zona = null) => {
  resetFormulario();
  if (zona) {
    modoEdicion.value = true;
    zonaEditando.value = zona;
    Object.assign(nuevaZona, zona);
  } else {
    modoEdicion.value = false;
    zonaEditando.value = null;
  }
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
};

const resetFormulario = () => {
  Object.assign(nuevaZona, {
    nombre_zona: '',
    descripcion: '',
    referencia: ''
  });
  errores.value = {};
  mensajeErrorApi.value = '';
};

const guardarZona = async () => {
  if (!validarFormulario()) return;
  mensajeErrorApi.value = '';

  try {
    if (modoEdicion.value) {
      await zonaApi.update(zonaEditando.value.id_zona, nuevaZona);
    } else {
      await zonaApi.create(nuevaZona);
    }
    await cargarZonas();
    cerrarFormulario();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al guardar la zona';
  }
};

const eliminarZona = async (id) => {
  if (!confirm('¿Está seguro de eliminar esta zona?')) return;
  mensajeErrorApi.value = '';
  try {
    await zonaApi.delete(id);
    await cargarZonas();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al eliminar la zona';
  }
};

onMounted(() => {
  cargarZonas();
});
</script>

<template>
  <div>
    <div v-if="cargando" class="cargando">
      <p>Cargando zonas...</p>
    </div>
    
    <div v-else-if="!zonas.length && !mensajeErrorApi" class="sin-productos">
      <h3>No hay zonas registradas</h3>
      <p>Presiona el botón "Nueva Zona" para agregar la primera.</p>
    </div>

    <p v-if="mensajeErrorApi && !mostrarFormulario" class="error-message api-error">{{ mensajeErrorApi }}</p>
    <div v-else>
      <div class="seccion-crud">
        <div class="crud-header">
          <h3>Listado de Zonas ({{ zonas.length }})</h3>
          <button class="btn-primary" @click="abrirFormulario()">
            + Nueva Zona
          </button>
        </div>

        <div class="tabla-contenedor">
          <table class="tabla-datos">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Referencia</th>
                <th class="acciones-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(zona, index) in zonas" :key="zona.id_zona">
                <td>{{ index + 1 }}</td>
                <td>{{ zona.nombre_zona }}</td>
                <td>{{ zona.descripcion }}</td>
                <td>{{ zona.referencia }}</td>
                <td class="acciones">
                  <button class="btn-editar" @click="abrirFormulario(zona)">
                    Editar
                  </button>
                  <button class="btn-eliminar" @click="eliminarZona(zona.id_zona)">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modoEdicion ? 'Editar Zona' : 'Nueva Zona' }}</h3>
          <button class="modal-close" @click="cerrarFormulario">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarZona">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>Nombre *</label>
                <input v-model="nuevaZona.nombre_zona" :class="{ 'error': errores.nombre_zona }">
                <span class="error-message" v-if="errores.nombre_zona">{{ errores.nombre_zona }}</span>
              </div>
              <div class="form-group full-width">
                <label>Descripción</label>
                <textarea v-model="nuevaZona.descripcion" rows="3"></textarea>
              </div>
              <div class="form-group full-width">
                <label>Referencia</label>
                <textarea v-model="nuevaZona.referencia" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-actions">
              <p v-if="mensajeErrorApi" class="error-message api-error">{{ mensajeErrorApi }}</p>
              <button type="button" @click="cerrarFormulario">Cancelar</button>
              <button type="submit">{{ modoEdicion ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>