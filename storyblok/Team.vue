<script setup>
import { Howl, Howler } from "howler";
import Card from "@/components/Card.vue";

Howler.volume(0.05);
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

function setRandomisedMembers() {
  if (slotMachineLocked.value) {
    reels.value = [[{ name: "🤦" }], [{ name: "🤦" }], [{ name: "🤦" }]];
    return;
  }
  const numCards = 20;
  const presentMembers = activeMembers.value.filter((member) => member.active);
  const winner = getRandomMember(presentMembers);
  const randomReels = new Array(3);
  for (let i = 0; i < randomReels.length; i++) {
    let currentMember = getRandomMember(presentMembers);
    randomReels[i] = [currentMember];
    for (let j = 0; j < numCards; j++) {
      let newMember = getRandomMember(presentMembers);
      while (newMember.name === currentMember.name) {
        newMember = getRandomMember(presentMembers);
      }
      randomReels[i].push(newMember);
      currentMember = newMember;
    }
  }
  let loser = getRandomMember(presentMembers);
  while (loser.name === winner.name) {
    loser = getRandomMember(presentMembers);
  }
  randomReels[2].unshift(winner);
  const chance = Math.random();
  if (chance < 1 / 3) {
    randomReels[0].unshift(winner);
    randomReels[1].unshift(winner);
  } else if (chance < 2 / 3) {
    randomReels[0].unshift(winner);
    randomReels[1].unshift(loser);
  } else {
    randomReels[0].unshift(loser);
    randomReels[1].unshift(winner);
  }
  reels.value = randomReels;
}

const mute = ref(true);
Howler.mute(mute.value);
function toggleAudio() {
  mute.value = !mute.value;
  Howler.mute(mute.value);
}

const song = new Howl({
  src: "/sounds/ES_Oranges or Pineapples.mp3",
});

const animate = ref(false);
const animationHandler = [];

function setUpAnimationHandlers() {}

async function spin() {
  if (animate.value) {
    animate.value = false;
    song.stop();
    setRandomisedMembers();
  } else {
    song.play();
    animate.value = true;
    setUpAnimationHandlers();
  }
}

function getRandomMember(members) {
  return members[Math.floor(Math.random() * members.length)];
}

const slotMachineLocked = ref(false);
function checkMachineLock() {
  if (activeMembers.value.reduce((acc, member) => acc + member.active, 0) < 2) {
    slotMachineLocked.value = true;
  } else {
    slotMachineLocked.value = false;
  }
}

function playSound(e) {
  if (e.target.classList.contains("teamMember")) {
    soundClicks[Math.floor(Math.random() * soundClicks.length)].play();
    checkMachineLock();
    setRandomisedMembers();
  }
}

onMounted(() => {
  checkMachineLock();
  setRandomisedMembers();
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
    <button class="startButton" @click="spin" :disabled="slotMachineLocked">
      {{ animate ? "Reset" : "Spin!" }}
    </button>
    <ul @click="playSound" v-if="blok.members" class="teamMembers">
      <li
        :class="`teamMember teamMember--${
          member.active ? 'active' : 'inactive'
        }`"
        v-for="member in activeMembers"
        :key="member._uid"
        @click="member.active = !member.active"
      >
        {{ member.active ? "✅" : "❌" }} {{ member.name }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 768px;
  margin: 0 auto;
  color: #fff;
}
.teamName {
  color: var(--primary);
  font-size: calc(var(--unit-size) * 8);
  margin-top: calc(var(--unit-size) * 4);
  margin-bottom: calc(var(--unit-size) * 3);
  text-transform: capitalize;
  text-shadow: 0 0 7px #fff, 0 0 10px #fff;
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
  border: 1px solid var(--primary);
  border-radius: var(--unit-size);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0px 11px 8px -10px #ccc, inset 0px -11px 8px -10px #ccc;
}
.reel:after {
  content: "";
  box-shadow: inset 0px 10px 15px -6px rgba(0, 0, 0);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.reelPlate {
  position: relative;
  top: 100%;
  transform: translateY(-100%);
}
.reelPlate--0.animate {
  animation: spin 7s ease-in-out 0.1s forwards;
}
.reelPlate--1.animate {
  animation: spin 7s ease-in-out 0.6s forwards;
}
.reelPlate--2.animate {
  animation: spin 7s ease-in-out 1.1s forwards;
}
@keyframes spin {
  0% {
    top: 100%;
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
    top: 0;
  }
}
.startButton {
  background: rgb(8, 204, 8);
  color: var(--secondary);
  cursor: pointer;
  border-radius: var(--unit-size);
  border: 1px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  margin-top: var(--unit-size);
  width: calc(var(--unit-size) * 25);
  padding: calc(var(--unit-size) * 3);
  font-weight: bold;
  font-size: calc(var(--unit-size) * 3);
}
.startButton:hover {
  border-bottom: 1px solid var(--primary);
  margin-top: calc(var(--unit-size) + 1px);
}
.startButton:active {
  border-top: 2px solid var(--primary);
  padding-bottom: calc((var(--unit-size) * 3) - 1px);
}
.startButton[disabled] {
  opacity: 0.3;
}
.teamMembers {
  margin-top: calc(var(--unit-size) * 4);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
}
.teamMember {
  background: var(--secondary);
  border: 1px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  border-radius: var(--unit-size);
  color: var(--primary);
  font-weight: bold;
  margin: calc(var(--unit-size) * 2);
  padding: calc(var(--unit-size) * 2);
  text-align: center;
  cursor: pointer;
}
.teamMember:hover {
  border-bottom: 1px solid var(--primary);
  margin-top: calc((var(--unit-size) * 2) + 1px);
}
.teamMember:active {
  border-top: 2px solid var(--primary);
  padding-bottom: calc((var(--unit-size) * 2) - 1px);
}
.teamMember--inactive {
  opacity: 0.3;
}
.toggleMute {
  cursor: pointer;
  position: absolute;
  top: var(--unit-size);
  right: var(--unit-size);
}
</style>
