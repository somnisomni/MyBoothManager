<template>
  <div class="mt-4">
    <RouterView v-slot="{ Component }">
      <VSlideXReverseTransition leave-absolute duration="200">
        <KeepAlive :include="keepAliveIncludeNames">
          <component :is="Component" />
        </KeepAlive>
      </VSlideXReverseTransition>
    </RouterView>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import GoodsOrdersListPage from "./GoodsOrderListPage.vue";

@Component({})
export default class GoodsOrdersRootPage extends Vue {
  get keepAliveIncludeNames() {
    return [ GoodsOrdersListPage.name ];
  }
}
</script>
