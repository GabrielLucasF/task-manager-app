import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (!authStore.token || !localStorage.getItem("token")) {
    navigateTo("/");
  }
});
