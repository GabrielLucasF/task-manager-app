<template>
  <div class="tasks-container">
    <button @click="logout" class="logout-button">Logout</button>
    <h2>Lista de Tarefas</h2>
    <form @submit.prevent="addTask" class="task-form">
      <div class="input-group">
        <label for="title">Título:</label>
        <input type="text" id="title" v-model="form.title" required>
      </div>
      <div class="input-group">
        <label for="description">Descrição:</label>
        <input type="text" id="description" v-model="form.description">
      </div>
      <div class="input-group">
        <label for="assigned_to">Atribuir a:</label>
        <select id="assigned_to" v-model="form.assigned_to">
          <option value="none">Ninguém</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
      </div>
      <button type="submit" class="submit-button">Adicionar Tarefa</button>
    </form>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" class="task-item">
        <div class="task-info">
          <div><strong>Título:</strong> {{ task.title }}</div>
          <div><strong>Descrição:</strong> {{ task.description }}</div>
          <div><strong>Atribuída a:</strong> {{ getAssignedToName(task) }}</div>
          <div><strong>Situação:</strong> {{ task.completed ? 'Concluída' : 'Pendente' }}</div>
        </div>
        <div class="task-actions">
          <button @click="editTask(task)" class="edit-button">Editar</button>
          <button @click="deleteTask(task.id)" class="delete-button">Excluir</button>
          <button @click="toggleCompletion(task)" class="toggle-button">
            {{ task.completed ? 'Desmarcar' : 'Marcar' }} como Concluída
          </button>
        </div>
      </li>
    </ul>
    <div v-if="isEditing" class="modal">
      <div class="modal-content">
        <h3>Editar Tarefa</h3>
        <form @submit.prevent="saveTask">
          <div class="input-group">
            <label for="edit-title">Título:</label>
            <input type="text" id="edit-title" v-model="form.title" required>
          </div>
          <div class="input-group">
            <label for="edit-description">Descrição:</label>
            <input type="text" id="edit-description" v-model="form.description">
          </div>
          <div class="input-group">
            <label for="edit-assigned_to">Atribuir a:</label>
            <select id="edit-assigned_to" v-model="form.assigned_to">
              <option value="none">Ninguém</option>
              <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
          </div>
          <button type="submit" class="submit-button">Salvar</button>
          <button @click="cancelEdit" type="button">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
const config = useRuntimeConfig();

const tasks = ref([]);
const users = ref([]);
const form = ref({
  title: '',
  description: '',
  completed: false,
  assigned_to: ''
});
let editedTaskId = null;
let isEditing = false;
const successMessage = ref('');

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await fetchTasks();
  await fetchUsers();
});

async function fetchTasks() {
  try {
    const response = await fetch(`${config.public.apiBase}/tasks`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      tasks.value = data;
    } else {
      const errorData = await response.json();
      console.error('Error fetching tasks:', errorData);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

async function fetchUsers() {
  try {
    const response = await fetch(`${config.public.apiBase}/users`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      users.value = data.users;
    } else {
      const errorData = await response.json();
      console.error('Error fetching users:', errorData);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function addTask() {
  try {

    if (form.value.assigned_to === 'none') {
      form.value.assigned_to = null;
    }

    const response = await fetch(`${config.public.apiBase}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form.value)

    });
    console.log(response.body)

    if (response.ok) {
      const data = await response.json();
      tasks.value.unshift(data.task);
      form.value.title = '';
      form.value.description = '';
      form.value.completed = false;
      form.value.assigned_to = '';
      alert('Tarefa adicionada com sucesso!');
      closeModal();
      await fetchUsers();
    } else {
      const errorData = await response.json();
      console.error('Error adding task:', errorData);
    }
  } catch (error) {
    console.error('Error adding task:', error);
  }
}

async function editTask(task) {
  form.value = { ...task };
  editedTaskId = task.id;
  isEditing = true;
}

async function saveTask() {
  try {
    if (form.value.assigned_to === 'none') {
      form.value.assigned_to = null;
    }

    const response = await fetch(`${config.public.apiBase}/tasks/${editedTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(form.value)
    });

    if (response.ok) {
      const data = await response.json();
      const index = tasks.value.findIndex(t => t.id === data.task.id);
      tasks.value[index] = data.task;
      alert('Tarefa editada com sucesso!');
      cancelEdit();
      closeModal();
    } else {
      const errorData = await response.json();
      console.error('Error updating task:', errorData);
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

function cancelEdit() {
  form.value = {
    title: '',
    description: '',
    completed: false,
    assigned_to: ''
  };
  editedTaskId = null;
  isEditing = false;
}

async function deleteTask(taskId) {
  try {
    const response = await fetch(`${config.public.apiBase}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      tasks.value = tasks.value.filter(task => task.id !== taskId);
      alert('Tarefa excluída com sucesso!');
    } else {
      const errorData = await response.json();
      console.error('Error deleting task:', errorData);
    }
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

async function toggleCompletion(task) {
  try {
    task.completed = !task.completed;

    const response = await fetch(`${config.public.apiBase}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(task)
    });

    if (response.ok) {
      const data = await response.json();
      const index = tasks.value.findIndex(t => t.id === data.task.id);
      tasks.value[index] = data.task;
    } else {
      const errorData = await response.json();
      console.error('Error updating task:', errorData);
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

function getAssignedToName(task) {
  if (task.assigned_to !== null && task.assigned_to !== undefined) {
    const assignedUser = users.value.find(user => user.id === task.assigned_to);
    return assignedUser ? assignedUser.name : 'Ninguém';
  } else {
    return 'Ninguém';
  }
}

async function logout() {
  try {
    const response = await fetch(`${config.public.apiBase}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      authStore.logout();
      alert('Sessão encerrada');
      router.push('/');
    } else {
      const errorData = await response.json();
      console.error('Error logging out:', errorData);
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

function closeModal() { }

</script>

<style scoped>
.tasks-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.logout-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  cursor: pointer;
}

.task-form {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 10px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.task-list {
  list-style-type: none;
  padding: 0;
}

.task-item {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 10px;
}

.task-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: left;
  margin-bottom: 20px;
}

.task-actions {
  display: flex;
  justify-content: space-between;
}

.edit-button,
.delete-button,
.toggle-button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

.edit-button {
  background-color: #2196f3;
  color: white;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.toggle-button {
  background-color: #ff9800;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  width: 400px;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.modal-content form {
  display: flex;
  flex-direction: column;
}

.modal-content .input-group {
  margin-bottom: 10px;
}

.modal-content label {
  margin-bottom: 5px;
}

.modal-content input,
.modal-content select {
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal-content .submit-button,
.modal-content button {
  padding: 10px 20px;
  margin-top: 10px;
  cursor: pointer;
}

.modal-content .submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
}

.modal-content button {
  background-color: #f44336;
  color: white;
  border: none;
}
</style>
