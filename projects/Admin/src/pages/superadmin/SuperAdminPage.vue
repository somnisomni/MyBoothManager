<template>
  <VContainer>
    <VBtn :to="{ name: 'logout' }">로그아웃</VBtn>
  </VContainer>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component({})
export default class SuperAdminPage extends Vue { }
</script>
