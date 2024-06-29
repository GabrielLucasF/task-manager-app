<template>
  <div>
    <TaskList />
  </div>
</template>

<script setup>
import TaskList from '~/components/TaskList.vue';
definePageMeta({
  middleware: 'auth'
});
</script>