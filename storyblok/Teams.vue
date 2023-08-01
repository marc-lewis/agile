<script setup>
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
  <div class="teams container">
    <h1 class="title">Teams</h1>
    <ul v-if="teams">
      <li v-for="team in teams" :key="team.id" class="team">
        <div class="teamNameContainer">
          <nuxt-link :to="`/teams/${team.slug}`" class="teamName">{{
            team.name
          }}</nuxt-link>
        </div>
        <ul v-if="team.content.members" class="members">
          <li
            v-for="member in team.content.members"
            :key="member.id"
            class="member"
          >
            {{ member.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.teams {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}
.title {
  font-size: calc(var(--unit-size) * 8);
}
.teamNameContainer {
  display: flex;
  justify-content: center;
  align-items: center;
}
.teamName {
  background: var(--primary);
  color: var(--secondary);
  /* display: block; */
  padding: var(--unit-size) calc(var(--unit-size) * 2);
  border-radius: var(--unit-size);
  font-size: calc(var(--unit-size) * 4);
  margin-top: calc(var(--unit-size) * 2);
}
.teamName:hover {
  background: var(--secondary);
  border: 1px solid var(--primary);
  color: var(--primary);
  padding: calc(var(--unit-size) - 1px) calc(var(--unit-size) * 2 - 1px);
}
.members {
  margin-top: calc(var(--unit-size) * 2);
  display: flex;
  flex-direction: row;
  gap: calc(var(--unit-size) * 2);
}
.member {
  background: #999999;
  color: var(--secondary);
  padding: var(--unit-size) var(--unit-size);
  border-radius: 9999px;
}
</style>
