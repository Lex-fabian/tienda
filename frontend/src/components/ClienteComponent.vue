<script setup>
import { ref, onMounted, reactive } from 'vue';
import { clienteApi } from '../services/apiService';
import '../style/cliente.css';

const clientes = ref([]);
const cargando = ref(true);
const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const clienteEditando = ref(null);
const errores = ref({});
const mensajeErrorApi = ref('');

const nuevoCliente = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  tipo_identificacion: 'C',
  identificacion: ''
});

const validarFormulario = () => {
  errores.value = {};
  if (!nuevoCliente.nombre.trim()) errores.value.nombre = 'El nombre es obligatorio';
  if (!nuevoCliente.apellido.trim()) errores.value.apellido = 'El apellido es obligatorio';
  if (!nuevoCliente.email.trim()) errores.value.email = 'El email es obligatorio';
  if (!nuevoCliente.telefono.trim()) errores.value.telefono = 'El teléfono es obligatorio';
  if (!nuevoCliente.identificacion.trim()) errores.value.identificacion = 'La identificación es obligatoria';
  if (nuevoCliente.email && !/^\S+@\S+\.\S+$/.test(nuevoCliente.email)) {
    errores.value.email = 'El email no es valido';
  }
  return Object.keys(errores.value).length === 0;
};

const cargarClientes = async () => {
  try {
    cargando.value = true;
    mensajeErrorApi.value = '';
    clientes.value = await clienteApi.getAll();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al cargar los clientes ';
  } finally {
    cargando.value = false;
  }
};

const abrirFormulario = (cliente = null) => {
  if (cliente) {
    modoEdicion.value = true;
    clienteEditando.value = { ...cliente };
    Object.assign(nuevoCliente, cliente);
  } else {
    modoEdicion.value = false;
    clienteEditando.value = null;
    resetFormulario();
  }
  errores.value = {};
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
  resetFormulario();
};

const resetFormulario = () => {
  Object.assign(nuevoCliente, {
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo_identificacion: 'C',
    identificacion: ''
  });
  errores.value = {};
  mensajeErrorApi.value = '';
};

const guardarCliente = async () => {
  if (!validarFormulario()) return;
  mensajeErrorApi.value = '';

  try {
    if (modoEdicion.value) {
      await clienteApi.update(clienteEditando.value.id_cliente, nuevoCliente);
    } else {
      await clienteApi.create(nuevoCliente);
    }
    await cargarClientes();
    cerrarFormulario();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al guardar el cliente';
  }
};

const eliminarCliente = async (id) => {
  if (!confirm('¿Está seguro de eliminar este cliente?')) return;
  mensajeErrorApi.value = '';

  try {
    await clienteApi.delete(id);
    await cargarClientes();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al eliminar el cliente';
  }
};

onMounted(cargarClientes);
</script>

<template>
  <div>
    <div v-if="cargando" class="cargando">
      <p>Cargando clientes...</p>
    </div>
    
    <div v-else>
      <div class="seccion-crud">
        <div class="crud-header">
          <h3>Listado de Clientes</h3>
          <button class="btn-primary" @click="abrirFormulario()">
            + Nuevo Cliente
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
                <th>Identificación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cliente, index) in clientes" :key="cliente.id_cliente">
                <td>{{ index + 1 }}</td>
                <td>{{ cliente.nombre }} {{ cliente.apellido }}</td>
                <td>{{ cliente.email }}</td>
                <td>{{ cliente.telefono }}</td>
                <td>{{ cliente.identificacion }}</td>
                <td class="acciones">
                  <button class="btn-editar" @click="abrirFormulario(cliente)">
                    Editar
                  </button>
                  <button class="btn-eliminar" @click="eliminarCliente(cliente.id_cliente)">
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
          <h3>{{ modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>
          <button class="modal-close" @click="cerrarFormulario">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarCliente">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="nuevoCliente.nombre" :class="{ 'error': errores.nombre }">
                <span class="error-message" v-if="errores.nombre">{{ errores.nombre }}</span>
              </div>
              <div class="form-group">
                <label>Apellido *</label>
                <input v-model="nuevoCliente.apellido" :class="{ 'error': errores.apellido }">
                <span class="error-message" v-if="errores.apellido">{{ errores.apellido }}</span>
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input v-model="nuevoCliente.email" type="email" :class="{ 'error': errores.email }">
                <span class="error-message" v-if="errores.email">{{ errores.email }}</span>
              </div>
              <div class="form-group">
                <label>Teléfono *</label>
                <input v-model="nuevoCliente.telefono" :class="{ 'error': errores.telefono }">
                <span class="error-message" v-if="errores.telefono">{{ errores.telefono }}</span>
              </div>
              <div class="form-group">
                <label>Identificación *</label>
                <input v-model="nuevoCliente.identificacion" :class="{ 'error': errores.identificacion }">
                <span class="error-message" v-if="errores.identificacion">{{ errores.identificacion }}</span>
              </div>
              <div class="form-group">
                <label>Tipo Identificación</label>
                <select v-model="nuevoCliente.tipo_identificacion">
                  <option value="C">Cédula</option>
                  <option value="P">Pasaporte</option>
                  <option value="R">RUC</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Dirección</label>
                <textarea v-model="nuevoCliente.direccion" rows="3"></textarea>
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
