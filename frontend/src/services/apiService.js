const API_BASE_URL = 'http://localhost:3000/api';

async function request(endpoint, options = {}) {
  const url = API_BASE_URL + endpoint;
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const authApi = {
  login: (credentials) => request('/login', { method: 'POST', body: JSON.stringify(credentials) }),
};

export const clienteApi = {
  getAll: () => request('/cliente'),
  create: (data) => request('/cliente', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/cliente/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/cliente/${id}`, { method: 'DELETE' }),
};

export const vendedorApi = {
  getAll: () => request('/vendedor'),
  create: (data) => request('/vendedor', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/vendedor/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/vendedor/${id}`, { method: 'DELETE' }),
};

export const zonaApi = {
  getAll: () => request('/zona'),
  create: (data) => request('/zona', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/zona/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/zona/${id}`, { method: 'DELETE' }),
};

export const productoApi = {
  getAll: () => request('/producto'),
  create: (data) => request('/producto', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/producto/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/producto/${id}`, { method: 'DELETE' }),
};

export const ventaApi = {
  getAll: () => request('/venta'),
  getById: (id) => request(`/venta/${id}`),
  create: (data) => request('/venta', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/venta/${id}`, { method: 'DELETE' }),
  getDashboardData: () => request('/venta/dashboard'),
  getZonasPorVendedor: () => request('/venta/por-vendedor'),
  getVendedoresSinVentas: (params) => request('/venta/vendedores-sin-ventas?fecha_inicio=' + params.inicio + '&fecha_fin=' + params.fin),
  getZonasSinVentas: (params) => request('/venta/zonas-sin-ventas?fecha_inicio=' + params.inicio + '&fecha_fin=' + params.fin),
  getVentasAnualesCliente: () => request('/venta/anuales'),
};