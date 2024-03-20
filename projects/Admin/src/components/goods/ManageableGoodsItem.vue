<template>
  <GoodsItem v-bind="props"
             :forceVisibility="GoodsStockVisibility.SHOW_ALL">
    <template #extra>
      EXTRA!
    </template>
  </GoodsItem>
</template>

<script lang="ts">
import type { GoodsItemProps } from "@myboothmanager/common-ui";
import { GoodsStockVisibility } from "@myboothmanager/common";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class ManageableGoodsItem extends Vue {
  readonly GoodsStockVisibility = GoodsStockVisibility;

  @Prop({ type: Object, required: true }) readonly props!: GoodsItemProps;

  menuOptions = [
    {
      icon: "mdi-content-duplicate",
      text: "복제",
      onClick: () => { },
    },
    {
      icon: "mdi-delete",
      text: "삭제",
      onClick: () => { },
    },
  ];
}
</script>
