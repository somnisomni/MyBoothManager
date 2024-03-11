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
import BoothAdminGoodsOrdersListPage from "./BoothAdminGoodsOrdersListPage.vue";

@Component({})
export default class BoothAdminGoodsOrdersRootPage extends Vue {
  get keepAliveIncludeNames() {
    return [ BoothAdminGoodsOrdersListPage.name ];
  }
}
</script>
