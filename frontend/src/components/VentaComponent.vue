<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { ventaApi, clienteApi, vendedorApi, zonaApi, productoApi } from '../services/apiService';
import '../style/venta.css';

const ventas = ref([]);
const cargando = ref(true);
const mostrarFormulario = ref(false);
const mostrarModalDetalles = ref(false);
const ventaSeleccionada = ref(null);

const clientes = ref([]);
const vendedores = ref([]);
const zonas = ref([]);
const productos = ref([]);
const errores = ref({});
const mensajeErrorApi = ref('');

const nuevaVenta = reactive({
  id_cliente: null,
  id_vendedor: null,
  id_zona: null,
  detalles: []
});

const productoParaAgregar = ref(null);
const cantidadParaAgregar = ref(1);

const montoTotal = computed(() => {
  return nuevaVenta.detalles.reduce((total, item) => total + item.subtotal, 0);
});

const cargarDatosIniciales = async () => {
  try {
    cargando.value = true;
    mensajeErrorApi.value = '';
    const [ventasData, clientesData, vendedoresData, zonasData, productosData] = await Promise.all([
      ventaApi.getAll(),
      clienteApi.getAll(),
      vendedorApi.getAll(),
      zonaApi.getAll(),
      productoApi.getAll()
    ]);
    ventas.value = ventasData;
    clientes.value = clientesData;
    vendedores.value = vendedoresData;
    zonas.value = zonasData;
    productos.value = productosData.map(p => ({
      ...p,
      precio: parseFloat(p.precio),
      stock: parseInt(p.stock)
    }));

  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al cargar los datos iniciales';
  } finally {
    cargando.value = false;
  }
};

const abrirFormulario = () => {
  resetFormulario();
  mostrarFormulario.value = true;
};

const cerrarFormulario = () => {
  mostrarFormulario.value = false;
};

const resetFormulario = () => {
  nuevaVenta.id_cliente = null;
  nuevaVenta.id_vendedor = null;
  nuevaVenta.id_zona = null;
  nuevaVenta.detalles = [];
  productoParaAgregar.value = null;
  cantidadParaAgregar.value = 1;
  errores.value = {};
  mensajeErrorApi.value = '';
};

const agregarProductoAlDetalle = () => {
  errores.value.detalle = '';
  if (!productoParaAgregar.value || !cantidadParaAgregar.value || cantidadParaAgregar.value <= 0) {
    errores.value.detalle = "Seleccione un producto y una cantidad valida";
    return;
  }

  const producto = productos.value.find(p => p.id_producto == productoParaAgregar.value);
  if (!producto) {
    errores.value.detalle = "Producto no encontrad";
    return;
  }

  if (cantidadParaAgregar.value > producto.stock) {
    errores.value.detalle = `Stock insuficiente. Disponible ${producto.stock}`;
    return;
  }

  const existente = nuevaVenta.detalles.find(d => d.id_producto == producto.id_producto);
  if (existente) {
    existente.cantidad += cantidadParaAgregar.value;
    existente.subtotal = existente.cantidad * existente.precio_unitario;
  } else {
    nuevaVenta.detalles.push({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre,
      cantidad: cantidadParaAgregar.value,
      precio_unitario: producto.precio,
      subtotal: cantidadParaAgregar.value * producto.precio
    });
  }

  productoParaAgregar.value = null;
  cantidadParaAgregar.value = 1;
};

const eliminarProductoDelDetalle = (id_producto) => {
  nuevaVenta.detalles = nuevaVenta.detalles.filter(d => d.id_producto !== id_producto);
};

const guardarVenta = async () => {
  errores.value = {};
  if (!nuevaVenta.id_cliente || !nuevaVenta.id_vendedor || !nuevaVenta.id_zona || nuevaVenta.detalles.length === 0) {
    if (!nuevaVenta.id_cliente) errores.value.cliente = 'Seleccione un cliente';
    if (!nuevaVenta.id_vendedor) errores.value.vendedor = 'Seleccione un vendedor';
    if (!nuevaVenta.id_zona) errores.value.zona = 'Seleccione una zona';
    if (nuevaVenta.detalles.length === 0) errores.value.detalle = 'Agregue al menos un producto';
    return;
  }

  mensajeErrorApi.value = '';
  try {
    const ventaData = {
      id_cliente: nuevaVenta.id_cliente,
      id_vendedor: nuevaVenta.id_vendedor,
      id_zona: nuevaVenta.id_zona,
      detalles: nuevaVenta.detalles.map(d => ({
        id_producto: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario
      }))
    };

    await ventaApi.create(ventaData);

    cerrarFormulario();
    await cargarDatosIniciales();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al crear la venta';
  }
};

const eliminarVenta = async (id) => {
  if (!confirm("¿Está seguro de eliminar esta venta?")) return;

  mensajeErrorApi.value = '';
  try {
    await ventaApi.delete(id);
    await cargarDatosIniciales();
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al eliminar la venta';
  }
};

const verDetalles = async (venta, index) => {
  mensajeErrorApi.value = '';
  try {
    const ventaData = await ventaApi.getById(venta.id_venta);
    ventaSeleccionada.value = {
      numeroFila: index + 1,
      ...ventaData.venta,
      detalles: ventaData.detalles || []
    };
    mostrarModalDetalles.value = true;
  } catch (error) {
    mensajeErrorApi.value = error.message || 'Error al cargar los detalles de la venta';
  }
};

onMounted(() => {
  cargarDatosIniciales();
});
</script>

<template>
  <div class="ventas-container">
    <div v-if="cargando" class="cargando">
      <p>Cargando ventas...</p>
    </div>

    <div v-else-if="!ventas.length && !mensajeErrorApi" class="sin-productos">
      <h3>No hay ventas registradas</h3>
      <p>Presiona el botón "Nueva Venta" para agregar la primera.</p>
    </div>

    <p v-if="mensajeErrorApi && !mostrarFormulario" class="error-message api-error">{{ mensajeErrorApi }}</p>
    <div v-else>
      <div class="crud-header">
        <h3>Listado de Ventas ({{ ventas.length }})</h3>
        <button class="btn-primary" @click="abrirFormulario">
          + Nueva Venta
        </button>
      </div>

      <div class="tabla-contenedor">
        <table class="tabla-datos">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Zona</th>
              <th>Monto Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
              <tr v-for="(venta, index) in ventas" :key="venta.id_venta">
              <td>{{ index + 1 }}</td>
              <td>{{ new Date(venta.fecha).toLocaleDateString() }}</td>
              <td>{{ venta.nombre_cliente || 'N/A' }}</td>
              <td>{{ venta.nombre_vendedor || 'N/A' }}</td>
              <td>{{ venta.nombre_zona || 'N/A' }}</td>
              <td>${{ parseFloat(venta.monto_total || 0).toFixed(2) }}</td>
              <td class="acciones">
                <button class="btn-ver" @click="verDetalles(venta, index)">
                  Ver
                </button>
                <button class="btn-eliminar" @click="eliminarVenta(venta.id_venta)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal modal-lg">
        <div class="modal-header">
          <h3>Nueva Venta</h3>
          <button class="modal-close" @click="cerrarFormulario">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="guardarVenta">
            <div class="form-grid-venta">
              <div class="form-group">
                <label>Cliente *</label>
                <select v-model="nuevaVenta.id_cliente" :class="{ 'error': errores.cliente }">
                  <option :value="null" disabled>-- Seleccione un cliente --</option>
                  <option v-for="c in clientes" :key="c.id_cliente" :value="c.id_cliente">
                    {{ c.nombre }} {{ c.apellido }}
                  </option>
                </select>
                <span class="error-message" v-if="errores.cliente">{{ errores.cliente }}</span>
              </div>

              <div class="form-group">
                <label>Vendedor *</label>
                <select v-model="nuevaVenta.id_vendedor" :class="{ 'error': errores.vendedor }">
                  <option :value="null" disabled>-- Seleccione un vendedor --</option>
                  <option v-for="v in vendedores" :key="v.id_vendedor" :value="v.id_vendedor">
                    {{ v.nombre }} {{ v.apellido }}
                  </option>
                </select>
                <span class="error-message" v-if="errores.vendedor">{{ errores.vendedor }}</span>
              </div>

              <div class="form-group">
                <label>Zona *</label>
                <select v-model="nuevaVenta.id_zona" :class="{ 'error': errores.zona }">
                  <option :value="null" disabled>-- Seleccione una zona --</option>
                  <option v-for="z in zonas" :key="z.id_zona" :value="z.id_zona">
                    {{ z.nombre_zona }}
                  </option>
                </select>
                <span class="error-message" v-if="errores.zona">{{ errores.zona }}</span>
              </div>
            </div>

            <div class="seccion-agregar-producto">
              <h4>Agregar Productos</h4>
              <div class="form-grid-producto">
                <div class="form-group-producto-select">
                  <label>Producto</label>
                  <select v-model="productoParaAgregar">
                    <option :value="null" disabled>-- Seleccione un producto --</option>
                    <option v-for="p in productos" :key="p.id_producto" :value="p.id_producto">
                      {{ p.nombre }} (Stock: {{ p.stock }})
                    </option>
                  </select>
                </div>

                <div class="form-group-producto-cantidad">
                  <label>Cantidad</label>
                  <input type="number" v-model.number="cantidadParaAgregar" min="1" max="1000">
                </div>

                <button type="button" class="btn-agregar-producto" @click="agregarProductoAlDetalle">
                  Agregar
                </button>
              </div>
              <span class="error-message" v-if="errores.detalle">{{ errores.detalle }}</span>
            </div>

            <div class="seccion-detalles-venta">
              <h4>Detalle de la Venta</h4>
              <table class="tabla-detalles">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="nuevaVenta.detalles.length === 0">
                    <td colspan="5" style="text-align: center;">
                      Agregue productos a la venta.
                    </td>
                  </tr>
                  <tr v-for="item in nuevaVenta.detalles" :key="item.id_producto">
                    <td>{{ item.nombre_producto }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>${{ item.precio_unitario.toFixed(2) }}</td>
                    <td>${{ item.subtotal.toFixed(2) }}</td>
                    <td>
                      <button type="button" class="btn-eliminar-item"
                              @click="eliminarProductoDelDetalle(item.id_producto)">
                        ×
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="text-align: right; font-weight: bold;">
                      TOTAL
                    </td>
                    <td style="font-weight: bold;">
                      ${{ montoTotal.toFixed(2) }}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="modal-actions">
              <p v-if="mensajeErrorApi" class="error-message api-error">{{ mensajeErrorApi }}</p>
              <button type="button" @click="cerrarFormulario">
                Cancelar
              </button>
              <button type="submit">
                Crear Venta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="mostrarModalDetalles && ventaSeleccionada" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h3>Detalles de Venta #{{ ventaSeleccionada.numeroFila }}</h3>
          <button class="modal-close" @click="mostrarModalDetalles = false">
            ×
          </button>
        </div>

        <div class="modal-body">
          <div class="info-venta">
            <p><strong>Cliente:</strong> {{ ventaSeleccionada.nombre_cliente || 'N/A' }}</p>
            <p><strong>Vendedor:</strong> {{ ventaSeleccionada.nombre_vendedor || 'N/A' }}</p>
            <p><strong>Zona:</strong> {{ ventaSeleccionada.nombre_zona || 'N/A' }}</p>
            <p><strong>Fecha:</strong> {{ new Date(ventaSeleccionada.fecha).toLocaleString() }}</p>
          </div>

          <table class="tabla-detalles">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ventaSeleccionada.detalles" :key="item.id_detalle_venta">
                <td>{{ item.nombre_producto }}</td>
                <td>{{ item.cantidad }}</td>
                <td>${{ parseFloat(item.precio_unitario || 0).toFixed(2) }}</td>
                <td>${{ parseFloat(item.subtotal || 0).toFixed(2) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; font-weight: bold;">
                  TOTAL
                </td>
                <td style="font-weight: bold;">
                  ${{ parseFloat(ventaSeleccionada.monto_total || 0).toFixed(2) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>