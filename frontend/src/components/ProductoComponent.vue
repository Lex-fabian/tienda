<script setup>
import { ref, onMounted, reactive } from 'vue';
import { productoApi } from '../services/apiService';
import '../style/producto.css'

const productos = ref([]);
const cargando = ref(true);
const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const productoEditando = ref(null);
const errores = ref({});
const mensajeErrorApi = ref('');

const categorias = [
  { value: 'E', label: 'Electronico' },
  { value: 'A', label: 'Alimento' },
  { value: 'L', label: 'Limpieza' },
  { value: 'T', label: 'Tecnología' }
];

const nuevoProducto = reactive({
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  categoria: 'E'
});

const validarFormulario = () => {
  errores.value = {};
  
  if (!nuevoProducto.nombre.trim()) errores.value.nombre = 'El nombre es obligatorio';
  if (!nuevoProducto.descripcion.trim()) errores.value.descripcion = 'La descripción es obligatoria';
  if (nuevoProducto.precio <= 0) errores.value.precio = 'El precio debe ser mayor a 0';
  if (nuevoProducto.stock < 0) errores.value.stock = 'El stock no puede ser negativo';
  
  return Object.keys(errores.value).length === 0;
};

const cargarProductos = async () => {
  try {
    cargando.value = true;
    mensajeErrorApi.value = '';
    const rawProductos = await productoApi.getAll();
    productos.value = rawProductos.map(p => ({
      ...p,
      precio: parseFloat(p.precio)
    }));
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al cargar los productos ';
  } finally {
    cargando.value = false;
  }
};

const abrirFormulario = (producto = null) => {
  if (producto) {
    modoEdicion.value = true;
    productoEditando.value = { ...producto };
    Object.assign(nuevoProducto, {
      ...producto,
      precio: parseFloat(producto.precio),
      stock: parseInt(producto.stock)
    });
  } else {
    modoEdicion.value = false;
    productoEditando.value = null;
    resetFormulario();
  }
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
};

const resetFormulario = () => {
  Object.assign(nuevoProducto, {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: 'E'
  });
  errores.value = {};
  mensajeErrorApi.value = '';
};

const guardarProducto = async () => {
  if (!validarFormulario()) return;
  mensajeErrorApi.value = '';

  try {
    if (modoEdicion.value) {
      await productoApi.update(productoEditando.value.id_producto, nuevoProducto);
    } else {
      await productoApi.create(nuevoProducto);
    }
    await cargarProductos();
    cerrarFormulario();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al guardar el producto';
  }
};

const eliminarProducto = async (id) => {
  if (!confirm('¿Está seguro de eliminar este producto?')) return;
  mensajeErrorApi.value = '';

  try {
    await productoApi.delete(id);
    await cargarProductos();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al eliminar el producto';
  }
};

const obtenerCategoriaLabel = (categoria) => {
  const cat = categorias.find(c => c.value === categoria);
  return cat ? cat.label : 'Desconocida';
};

onMounted(cargarProductos);
</script>

<template>
  <div class="productos-container">
    <div v-if="cargando" class="cargando">
      <p>Cargando productos...</p>
    </div>
    
    <div v-else-if="productos.length === 0" class="sin-productos">
      <h3>No hay productos registrados</h3>
      <p>Presiona el botón "Nuevo Producto" para agregar el primero</p>
    </div>
    
    <p v-if="mensajeErrorApi && !mostrarFormulario" class="error-message api-error">{{ mensajeErrorApi }}</p>
    <div v-else>
      <div class="seccion-crud">
        <div class="crud-header">
          <h3>Listado de Productos ({{ productos.length }})</h3>
          <button class="btn-primary" @click="abrirFormulario()">
            + Nuevo Producto
          </button>
        </div>

        <div class="tabla-contenedor">
          <table class="tabla-datos">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th class="acciones-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(producto, index) in productos" :key="producto.id_producto">
                <td>{{ index + 1 }}</td>
                <td>{{ producto.nombre }}</td>
                <td class="descripcion-cell">{{ producto.descripcion }}</td>
                <td>${{ producto.precio?.toFixed(2) }}</td>
                <td>
                  <span :class="{'stock-bajo': producto.stock < 10}">
                    {{ producto.stock }}
                  </span>
                </td>
                <td>
                  <span class="categoria-badge" :class="'categoria-' + producto.categoria">
                    {{ obtenerCategoriaLabel(producto.categoria) }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="btn-editar" @click="abrirFormulario(producto)">
                    Editar
                  </button>
                  <button class="btn-eliminar" @click="eliminarProducto(producto.id_producto)">
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
          <h3>{{ modoEdicion ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button class="modal-close" @click="cerrarFormulario">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarProducto">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre *</label>
                <input v-model="nuevoProducto.nombre" :class="{ 'error': errores.nombre }">
                <span class="error-message" v-if="errores.nombre">{{ errores.nombre }}</span>
              </div>
              <div class="form-group">
                <label>Descripción *</label>
                <textarea v-model="nuevoProducto.descripcion" rows="3" :class="{ 'error': errores.descripcion }"></textarea>
                <span class="error-message" v-if="errores.descripcion">{{ errores.descripcion }}</span>
              </div>
              <div class="form-group">
                <label>Precio *</label>
                <input v-model.number="nuevoProducto.precio" type="number" step="0.01" min="0" :class="{ 'error': errores.precio }">
                <span class="error-message" v-if="errores.precio">{{ errores.precio }}</span>
              </div>
              <div class="form-group">
                <label>Stock *</label>
                <input v-model.number="nuevoProducto.stock" type="number" min="0" :class="{ 'error': errores.stock }">
                <span class="error-message" v-if="errores.stock">{{ errores.stock }}</span>
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <select v-model="nuevoProducto.categoria">
                  <option v-for="cat in categorias" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
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
