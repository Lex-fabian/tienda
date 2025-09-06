<script setup>
import { ref, onMounted, reactive } from 'vue';
import { vendedorApi } from '../services/apiService';
import '../style/vendedor.css';

const vendedores = ref([]);
const cargando = ref(true);
const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const vendedorEditando = ref(null);
const errores = ref({});
const mensajeErrorApi = ref('');

const nuevoVendedor = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  tipo_identificacion: 'C',
  identificacion: '',
  usuario: '',
  clave: ''
});

const validarFormulario = () => {
  errores.value = {};
  if (!nuevoVendedor.nombre.trim()) errores.value.nombre = 'El nombre es obligatorio';
  if (!nuevoVendedor.apellido.trim()) errores.value.apellido = 'El apellido es obligatorio';
  if (!nuevoVendedor.email.trim()) errores.value.email = 'El email es obligatorio';
  if (nuevoVendedor.email && !/^\S+@\S+\.\S+$/.test(nuevoVendedor.email)) {
    errores.value.email = 'El email no es valido';
  }
  if (!nuevoVendedor.identificacion.trim()) errores.value.identificacion = 'La identificacion es obligatoria';
  if (!nuevoVendedor.usuario.trim()) errores.value.usuario = 'El usuario es obligatorio';
  if (!modoEdicion.value && !nuevoVendedor.clave) errores.value.clave = 'La clave es obligatoria';

  return Object.keys(errores.value).length === 0;
};

const cargarVendedores = async () => {
  try {
    cargando.value = true;
    mensajeErrorApi.value = '';
    vendedores.value = await vendedorApi.getAll();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al cargar los vendedores';
  } finally {
    cargando.value = false;
  }
};

const abrirFormulario = (vendedor = null) => {
  if (vendedor) {
    modoEdicion.value = true;
    vendedorEditando.value = vendedor;
    Object.assign(nuevoVendedor, vendedor);
    nuevoVendedor.clave = ''; 
  } else {
    modoEdicion.value = false;
    vendedorEditando.value = null;
    resetFormulario();
  }
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
};

const resetFormulario = () => {
  Object.assign(nuevoVendedor, {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo_identificacion: 'C',
    identificacion: '',
    usuario: '',
    clave: ''
  });
  errores.value = {};
  mensajeErrorApi.value = '';
};

const guardarVendedor = async () => {
  if (!validarFormulario()) return;
  mensajeErrorApi.value = '';

  const payload = { ...nuevoVendedor };
  if (modoEdicion.value && !payload.clave) {
    delete payload.clave; 
  }

  try {
    if (modoEdicion.value) {
      await vendedorApi.update(vendedorEditando.value.id_vendedor, payload);
    } else {
      await vendedorApi.create(payload);
    }
    await cargarVendedores();
    cerrarFormulario();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al guardar el vendedor';
  }
};

const eliminarVendedor = async (id) => {
  if (!confirm('¿Está seguro de eliminar este vendedor?')) return;
  mensajeErrorApi.value = '';

  try {
    await vendedorApi.delete(id);
    await cargarVendedores();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al eliminar el vendedor';
  }
};

onMounted(() => {
  cargarVendedores();
});
</script>

<template>
  <div>
    <div v-if="cargando" class="cargando">
      <p>Cargando vendedores...</p>
    </div>

    <div v-else-if="!vendedores.length && !mensajeErrorApi" class="sin-productos">
      <h3>No hay vendedores registrados</h3>
      <p>Presiona el botón "Nuevo Vendedor" para agregar el primero.</p>
    </div>

    <p v-if="mensajeErrorApi && !mostrarFormulario" class="error-message api-error">{{ mensajeErrorApi }}</p>
    <div v-else>
      <div class="seccion-crud">
        <div class="crud-header">
          <h3>Listado de Vendedores ({{ vendedores.length }})</h3>
          <button class="btn-primary" @click="abrirFormulario()">
            + Nuevo Vendedor
          </button>
        </div>

        <div class="tabla-contenedor">
          <table class="tabla-datos">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Usuario</th>
                <th>Identificación</th>
                <th class="acciones-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vendedor, index) in vendedores" :key="vendedor.id_vendedor">
                <td>{{ index + 1 }}</td>
                <td>{{ vendedor.nombre }} {{ vendedor.apellido }}</td>
                <td>{{ vendedor.email }}</td>
                <td>{{ vendedor.telefono }}</td>
                <td>{{ vendedor.usuario }}</td>
                <td>{{ vendedor.identificacion }}</td>
                <td class="acciones">
                  <button class="btn-editar" @click="abrirFormulario(vendedor)">
                    Editar
                  </button>
                  <button class="btn-eliminar" @click="eliminarVendedor(vendedor.id_vendedor)">
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
          <h3>{{ modoEdicion ? 'Editar Vendedor' : 'Nuevo Vendedor' }}</h3>
          <button class="modal-close" @click="cerrarFormulario">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarVendedor">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="nuevoVendedor.nombre" :class="{ 'error': errores.nombre }">
                <span class="error-message" v-if="errores.nombre">{{ errores.nombre }}</span>
              </div>
              <div class="form-group">
                <label>Apellido *</label>
                <input v-model="nuevoVendedor.apellido" :class="{ 'error': errores.apellido }">
                <span class="error-message" v-if="errores.apellido">{{ errores.apellido }}</span>
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input v-model="nuevoVendedor.email" type="email" :class="{ 'error': errores.email }">
                <span class="error-message" v-if="errores.email">{{ errores.email }}</span>
              </div>
              <div class="form-group">
                <label>Teléfono</label>
                <input v-model="nuevoVendedor.telefono">
              </div>
              <div class="form-group">
                <label>Usuario *</label>
                <input v-model="nuevoVendedor.usuario" :class="{ 'error': errores.usuario }">
                <span class="error-message" v-if="errores.usuario">{{ errores.usuario }}</span>
              </div>
              <div class="form-group">
                <label>Clave *</label>
                <input v-model="nuevoVendedor.clave" type="password" :required="!modoEdicion" :class="{ 'error': errores.clave }">
                <span class="error-message" v-if="errores.clave">{{ errores.clave }}</span>
              </div>
              <div class="form-group">
                <label>Identificación *</label>
                <input v-model="nuevoVendedor.identificacion" :class="{ 'error': errores.identificacion }">
                <span class="error-message" v-if="errores.identificacion">{{ errores.identificacion }}</span>
              </div>
              <div class="form-group">
                <label>Tipo Identificación</label>
                <select v-model="nuevoVendedor.tipo_identificacion">
                  <option value="C">Cédula</option>
                  <option value="P">Pasaporte</option>
                  <option value="R">RUC</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Dirección</label>
                <textarea v-model="nuevoVendedor.direccion" rows="3"></textarea>
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
