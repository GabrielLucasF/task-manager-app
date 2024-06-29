<template>
  <form @submit.prevent="register" class="form-container">
    <div class="form-group">
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="form.name" required>
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="form.email" required>
      <span v-if="emailError" class="error-message">{{ emailError }}</span>
    </div>
    <div class="form-group">
      <label for="password">Password:</label>
      <input type="password" id="password" v-model="form.password" required>
    </div>
    <div class="form-group">
      <label for="password_confirmation">Confirm Password:</label>
      <input type="password" id="password_confirmation" v-model="form.password_confirmation" required>
    </div>
    <button type="submit">Register</button>
  </form>
  <p class="login-link">Already have an account? <router-link to="/">Login here</router-link></p>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const config = useRuntimeConfig();

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

let emailError = '';
const router = useRouter();

async function register() {
  try {
    if (form.value.password !== form.value.password_confirmation) {
      alert('As senhas digitadas não correspondem.');
      return;
    }

    if (form.value.password.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    const response = await fetch(`${config.public.apiBase}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        password_confirmation: form.value.password_confirmation
      })
    });

    if (response.ok) {
      const data = await response.json();
      alert('Registrado com sucesso!');
      goToLogin();
    } else {
      const errorData = await response.json();
      if (errorData.errors && errorData.errors.email) {
        emailError = errorData.errors.email[0];
      }
      console.error(errorData);
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
}

const goToLogin = () => {
  router.push('/');
};
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

input[type="text"],
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
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #218838;
}

.error-message {
  color: red;
  font-size: 14px;
}

.login-link {
  margin-top: 10px;
  text-align: center;
}
</style>
