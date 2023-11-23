<template>
  <RouterView v-slot="{ Component }">
    <VSlideXReverseTransition leave-absolute>
      <component :is="Component" />
    </VSlideXReverseTransition>
  </RouterView>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component({})
export default class BoothAdminGoodsOrdersRootPage extends Vue { }
</script>
