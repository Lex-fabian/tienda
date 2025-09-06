<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from './services/apiService';

const router = useRouter();
const usuario = ref('');
const clave = ref('');
const mensajeError = ref('');
const cargando = ref(false);

const login = async () => {
  if (!usuario.value || !clave.value) {
    mensajeError.value = 'Por favor ingrese usuario y clave.';
    return;
  }

  cargando.value = true;
  mensajeError.value = '';

  try {
    const data = await authApi.login({ usuario: usuario.value, clave: clave.value });
    localStorage.setItem('token', data.token);
    router.push('/inicio');
  } catch (error) {
    // El error ya viene formateado desde apiService
    mensajeError.value = error.message || 'Error de conexión. Inténtelo de nuevo.';
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="form-contenedor">
    <div class="formulario">
      <h3>Bienvenido</h3>
      <div class="input-grupo">
        <label for="usuario">Usuario</label>
        <input type="text" id="usuario" v-model="usuario" :disabled="cargando" @keyup.enter="login" />
      </div>
      <div class="input-grupo">
        <label for="clave">Contraseña</label>
        <input type="password" id="clave" v-model="clave" :disabled="cargando" @keyup.enter="login" />
      </div>
      <p v-if="mensajeError" class="mensaje-error">{{ mensajeError }}</p>
      <button @click="login" :disabled="cargando">
        {{ cargando ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </div>
  </div>
</template>