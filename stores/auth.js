import { defineStore } from "pinia";
import axios from "axios";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
  }),
  actions: {
    async login(email, password) {
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(`${config.public.apiBase}/login`, {
          email,
          password,
        });

        this.token = response.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        await this.fetchUser();
      } catch (error) {
        console.error("Failed to login:", error);
        throw error;
      }
    },
    async register(name, email, password) {
      try {
        const config = useRuntimeConfig();
        const response = await axios.post(`${config.public.apiBase}/register`, {
          name,
          email,
          password,
        });

        this.token = response.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

        await this.fetchUser();
      } catch (error) {
        console.error("Failed to register:", error);
        throw error;
      }
    },
    async fetchUser() {
      try {
        const config = useRuntimeConfig();
        const response = await axios.get(`${config.public.apiBase}/user`);

        this.user = response.data.user;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error;
      }
    },
    async logout() {
      try {
        const config = useRuntimeConfig();
        await axios.post(`${config.public.apiBase}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });

        this.token = null;
        this.user = null;
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem('token');
      } catch (error) {
        console.error("Failed to logout:", error);
        throw error;
      }
    },
  },
});
