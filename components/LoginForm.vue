<template>
  <form @submit.prevent="login" class="form-container">
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="form.email" required>
    </div>
    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="form.password" required>
    </div>
    <button type="submit">Login</button>
    <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
const config = useRuntimeConfig();

const form = ref({
  email: '',
  password: ''
});

const router = useRouter();
const authStore = useAuthStore();

async function login() {
  try {
    const response = await fetch(`${config.public.apiBase}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password
      })
    });

    if (response.ok) {
      const data = await response.json();
      authStore.token = data.token;
      router.push('/tasks');
      localStorage.setItem('token', authStore.token);
    } else {
      const errorData = await response.json();
      console.error(errorData);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
}

input[type="email"],
input[type="password"] {
  width: 95%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3;
}

p {
  margin-top: 10px;
  text-align: center;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
  .form-container {
    padding: 15px;
    max-width: 100%;
    box-shadow: none;
  }

  button {
    margin-top: 30px;
  }
}

@media (max-width: 480px) {

  input[type="email"],
  input[type="password"] {
    font-size: 14px;
  }

  button {
    padding: 10px;
    margin-top: 20px;
  }
}
</style>
