<script setup>
defineProps({ blok: Object });

const teams = ref(null);
const storyblokApi = useStoryblokApi();
const { data } = await storyblokApi.get("cdn/stories", {
  version: "draft",
  starts_with: "team",
  is_startpage: false,
});
teams.value = data.stories;
</script>
<template>
  <div>
    <h1>Teams</h1>
    <ul v-if="teams">
      <h2>Team</h2>
      <li v-for="team in teams" :key="team.id">
        <nuxt-link :to="`/teams/${team.slug}`">{{ team.name }}</nuxt-link>
        <h3>Members</h3>
        <ul v-if="team.content.members">
          <li v-for="member in team.content.members" :key="member.id">
            {{ member.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
