<script setup lang="ts">
import env from '@/config/env'
</script>

<template>
  <div class="home-page">
    <LanguageSwitcher />

    <div class="hero-section">
      <HelloWorld msg="Vite + Vue + Sass" />
    </div>

    <div class="env-info">
      <h2 class="info-title">
        环境信息
      </h2>
      <div class="info-table">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, get-color(gray-50), get-color(white));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: spacing(4);
}

.hero-section {
  @include flex-center;
  @include flex-column;
  padding: spacing(12) spacing(4);
  text-align: center;
  width: 100%;
  max-width: 1200px;
}

.env-info {
  max-width: 800px;
  width: 100%;
  margin: spacing(12) auto;
  padding: spacing(8);
  background: get-color(white);
  border-radius: border-radius(xl);
  box-shadow: shadow(md);
}

.info-title {
  font-size: font-size(2xl);
  font-weight: font-weight(semibold);
  color: get-color(gray-800);
  margin-bottom: spacing(6);
  text-align: center;
}

.info-table {
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border-radius: border-radius(lg);
    overflow: hidden;
    box-shadow: shadow(sm);
  }

  th {
    background: get-color(gray-800);
    color: get-color(white);
    font-weight: font-weight(semibold);
    padding: spacing(4);
    text-align: left;
  }

  td {
    padding: spacing(3) spacing(4);
    border-bottom: 1px solid get-color(gray-200);

    &:first-child {
      font-weight: font-weight(medium);
      color: get-color(gray-700);
    }

    &:last-child {
      color: get-color(gray-600);
      font-family: $font-family-mono;
    }
  }

  tr:hover {
    background: get-color(gray-50);
  }
}
</style>
