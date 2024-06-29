import { defineStore } from "pinia";
import axios from "axios";
import { useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [],
  }),
  actions: {
    async fetchTasks() {
      const { data } = await axios.get(`${config.public.apiBase}/tasks`);
      this.tasks = data;
    },
    async createTask(task) {
      const { data } = await axios.post(`${config.public.apiBase}/tasks`, task);
      this.tasks.push(data.task);
    },
    async updateTask(task) {
      const { data } = await axios.put(
        `${config.public.apiBase}/tasks/${task.id}`,
        task
      );
      const index = this.tasks.findIndex((t) => t.id === task.id);
      this.tasks[index] = data.task;
    },
    async deleteTask(taskId) {
      await axios.delete(`${config.public.apiBase}/tasks/${taskId}`);
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
    },
  },
});
