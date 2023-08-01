// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    ['@storyblok/nuxt', { accessToken: process.env.STORYBLOCK_PREVIEW_TOKEN }],
    '@nuxtjs/tailwindcss',
  ],
  build: {
    transpile: ['fsevents'],
  },
  css: ['~/assets/css/tokens.css'],
});
