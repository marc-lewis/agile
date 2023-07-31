<script setup>
const props = defineProps({ name: String });
</script>
<template>
  <div class="card">
    {{ props.name }}
  </div>
</template>
<style scoped>
:root {
  --unit-size: 8px;
  --primary: #222222;
  --secondary: #fefefe;
}
.card {
  background: var(--secondary);
  color: var(--primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  font-weight: bold;
  width: 100%;
  aspect-ratio: 1.16;
}
</style>
