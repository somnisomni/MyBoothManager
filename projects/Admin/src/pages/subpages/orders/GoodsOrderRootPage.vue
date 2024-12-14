<template>
  <div class="mt-4">
    <RouterView v-slot="{ Component }">
      <VSlideXReverseTransition leaveAbsolute
                                duration="200">
        <KeepAlive :include="keepAliveIncludeNames">
          <component :is="Component" />
        </KeepAlive>
      </VSlideXReverseTransition>
    </RouterView>
  </div>
</template>

<script lang="ts">
import { Component, toNative, Vue } from "vue-facing-decorator";
import GoodsOrdersListPage from "./GoodsOrderListPage.vue";

@Component({})
class GoodsOrdersRootPage extends Vue {
  get keepAliveIncludeNames() {
    return [ GoodsOrdersListPage.name ];
  }
}

export default toNative(GoodsOrdersRootPage);
</script>
