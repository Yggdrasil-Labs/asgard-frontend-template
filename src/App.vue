<script setup lang="ts">
import env from '@/config/env'
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo">
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo">
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <table style="margin: 20px auto;">
    <thead style="background-color: #e0e0e0;">
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody style="background-color: #f0f0f0;">
      <tr>
        <td>mode</td>
        <td>{{ env.MODE }}</td>
      </tr>
      <tr>
        <td>appEnv</td>
        <td>{{ env.APP_ENV }}</td>
      </tr>
      <tr>
        <td>appName</td>
        <td>{{ env.APP_NAME }}</td>
      </tr>
      <tr>
        <td>appVersion</td>
        <td>{{ env.APP_VERSION }}</td>
      </tr>
      <tr>
        <td>apiBaseUrl</td>
        <td>{{ env.API_BASE_URL }}</td>
      </tr>
      <tr>
        <td>isDev</td>
        <td>{{ env.isDev }}</td>
      </tr>
      <tr>
        <td>isProd</td>
        <td>{{ env.isProd }}</td>
      </tr>
      <tr>
        <td>isTest</td>
        <td>{{ env.isTest }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
