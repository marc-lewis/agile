<template>
  <div v-editable="blok" class="px-4">
    <StoryblokComponent
      v-for="blok in blok.body"
      :key="blok._uid"
      :blok="blok"
    />
    test
  </div>
</template>

<script setup>
defineProps({ blok: Object });
console.log("test");
</script>
