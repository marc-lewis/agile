<script setup>
import { Howl, Howler } from "howler";
import Card from "@/components/Card.vue";

const { slug } = useRoute().params;
const teamName = slug[1];
const props = defineProps({ blok: Object });
const sourceClicks = [
  "/sounds/ES_Human Mouth Click 1.mp3",
  "/sounds/ES_Human Mouth Click 2.mp3",
  "/sounds/ES_Human Mouth Cluck.mp3",
  "/sounds/ES_Tongue Click Mouth.mp3",
];
const soundClicks = [];
for (let i = 0; i < sourceClicks.length; i++) {
  soundClicks[i] = new Howl({
    src: sourceClicks[i],
  });
}

const activeMembers = ref([]);
activeMembers.value = props.blok.members.map((member) => {
  return { ...member, active: true };
});

const reels = ref([]);

function getRandomisedMembers() {
  const numCards = 20;
  const presentMembers = activeMembers.value.filter((member) => member.active);
  const winner = getRandomMember(presentMembers);
  const reels = new Array(3);
  for (let i = 0; i < reels.length; i++) {
    let currentMember = getRandomMember(presentMembers);
    reels[i] = [currentMember];
    for (let j = 0; j < numCards; j++) {
      let newMember = getRandomMember(presentMembers);
      while (newMember.name === currentMember.name) {
        newMember = getRandomMember(presentMembers);
      }
      reels[i].push(newMember);
      currentMember = newMember;
    }
  }
  let loser = getRandomMember(presentMembers);
  while (loser.name === winner.name) {
    loser = getRandomMember(presentMembers);
  }
  reels[2][numCards] = winner;
  const chance = Math.random();
  if (chance < 1 / 3) {
    reels[0][numCards] = winner;
    reels[1][numCards] = winner;
  } else if (chance < 2 / 3) {
    reels[0][numCards] = winner;
    reels[1][numCards] = loser;
  } else {
    reels[0][numCards] = loser;
    reels[1][numCards] = winner;
  }
  return reels;
}

const mute = ref(true);
function toggleAudio() {
  mute.value = !mute.value;
  Howler.mute(mute.value);
}

const song = new Howl({
  src: "/sounds/ES_Oranges or Pineapples.mp3",
});

const animate = ref(false);

async function spin() {
  if (animate.value) {
    animate.value = false;
    song.stop();
    reels.value = getRandomisedMembers();
  } else {
    song.play();
    animate.value = true;
  }
}

function getRandomMember(members) {
  return members[Math.floor(Math.random() * members.length)];
}

function playSound(e) {
  if (e.target.classList.contains("teamMember")) {
    soundClicks[Math.floor(Math.random() * soundClicks.length)].play();
    reels.value = getRandomisedMembers();
  }
}

onMounted(() => {
  reels.value = getRandomisedMembers();
});
</script>

<template>
  <div class="team">
    <span class="toggleMute" @click="toggleAudio">{{
      mute ? "🔇" : "🔈"
    }}</span>
    <h1 class="teamName">{{ teamName }}</h1>
    <div class="reels">
      <div v-for="(reel, i) in reels" :key="i" :class="`reel reel--${i}`">
        <div :class="`reelPlate ${animate ? 'animate' : ''} reelPlate--${i}`">
          <Card v-for="(card, i) in reel" :key="i" :name="card.name" />
        </div>
      </div>
    </div>
    <button class="startButton" @click="spin">
      {{ animate ? "Reset" : "Go!" }}
    </button>
    <ul @click="playSound" v-if="blok.members" class="teamMembers">
      <li
        class="teamMember"
        v-for="member in activeMembers"
        :key="member._uid"
        @click="member.active = !member.active"
      >
        {{ member.active ? "✅" : "❌" }} {{ member.name }}
      </li>
    </ul>
  </div>
</template>

<style scope>
:root {
  --unit-size: 8px;
  --black: #222222;
}
.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 768px;
  margin: 0 auto;
}
.teamName {
  color: var(--black);
  font-size: calc(var(--unit-size) * 8);
  margin-top: calc(var(--unit-size) * 4);
  margin-bottom: calc(var(--unit-size) * 3);
  text-transform: capitalize;
}
.reels {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--unit-size) * 5);
  margin-bottom: calc(var(--unit-size) * 2);
}
.reel {
  aspect-ratio: 1.16;
  border: 1px solid var(--black);
  border-radius: var(--unit-size);
  overflow: hidden;
  position: relative;
}
.reelPlate {
  position: relative;
  top: 0;
}
.reelPlate--0.animate {
  animation: spin 10s ease-in-out 0.5s forwards;
}
.reelPlate--1.animate {
  animation: spin 10s ease-in-out 1s forwards;
}
.reelPlate--2.animate {
  animation: spin 10s ease-in-out 1.5s forwards;
}
@keyframes spin {
  0% {
    transform: translateY(0);
    top: 0;
  }
  100% {
    top: 100%;
    transform: translateY(-100%);
  }
}
.startButton {
  color: var(--black);
  cursor: pointer;
  border-radius: var(--unit-size);
  border: 1px solid var(--black);
  border-bottom: 2px solid var(--black);
  margin-top: var(--unit-size);
  width: calc(var(--unit-size) * 25);
  padding: calc(var(--unit-size) * 3);
  font-weight: bold;
  font-size: calc(var(--unit-size) * 3);
}
.startButton:hover {
  border-bottom: 1px solid var(--black);
  margin-top: calc(var(--unit-size) + 1px);
}
.startButton:active {
  border-top: 2px solid var(--black);
  padding-bottom: calc((var(--unit-size) * 3) - 1px);
}
.teamMembers {
  margin-top: calc(var(--unit-size) * 4);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
}
.teamMember {
  border: 1px solid var(--black);
  border-bottom: 2px solid var(--black);
  border-radius: var(--unit-size);
  color: var(--black);
  font-weight: bold;
  margin: calc(var(--unit-size) * 2);
  padding: calc(var(--unit-size) * 2);
  text-align: center;
  cursor: pointer;
}
.teamMember:hover {
  border-bottom: 1px solid var(--black);
  margin-top: calc((var(--unit-size) * 2) + 1px);
}
.teamMember:active {
  border-top: 2px solid var(--black);
  padding-bottom: calc((var(--unit-size) * 2) - 1px);
}
.toggleMute {
  cursor: pointer;
  position: absolute;
  top: var(--unit-size);
  right: var(--unit-size);
}
</style>
