<template>
  <div class="mt-4">
    <RouterView v-slot="{ Component }">
      <VSlideXReverseTransition leave-absolute>
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </VSlideXReverseTransition>
    </RouterView>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";

@Component({})
export default class BoothAdminGoodsOrdersRootPage extends Vue { }
</script>
