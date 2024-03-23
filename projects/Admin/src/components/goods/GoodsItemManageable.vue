<template>
  <GoodsItem ref="base"
             :forceStockVisibility="forceStockVisibility"
             class="manageable">
    <template #extra-top-indicator>
      <!-- Click to edit indicator -->
      <div class="top-indicator click-to-edit">
        <VIcon class="mr-1"
               icon="mdi-pencil" />
        <span>클릭하여 수정</span>
      </div>
    </template>

    <!-- Menu options -->
    <div v-if="menuOptions.length > 0" class="menu">
      <VBtn class="menu-activator" color="white" variant="text" icon>
        <VIcon icon="mdi-dots-vertical" />

        <VMenu activator="parent">
          <VList>
            <VListItem v-for="(option, index) in menuOptions"
                      :key="index"
                      :prepend-icon="option.icon"
                      :class="option.color ? `text-${option.color}` : ''"
                      @click="option.onClick">{{ option.text }}</VListItem>
          </VList>
        </VMenu>
      </VBtn>
    </div>
  </GoodsItem>
</template>

<script lang="ts">
import type { GoodsItem, GoodsItemProps } from "@myboothmanager/common-ui";
import { GoodsStockVisibility } from "@myboothmanager/common";
import { Component, Emit, Ref, Vue } from "vue-facing-decorator";
import { markRaw } from "vue";

export interface IGoodsItemMenuOption {
  icon: string;
  text: string;
  color?: string;
  onClick: () => void;
}

@Component({
  emits: ["menu:duplicate", "menu:delete"],
})
export default class GoodsItemManageable extends Vue {
  readonly forceStockVisibility = GoodsStockVisibility.SHOW_ALL;

  readonly menuOptions: IGoodsItemMenuOption[] = markRaw([
    {
      icon: "mdi-content-duplicate",
      text: "복제",
      onClick: this.onMenuDuplicate,
    },
    {
      icon: "mdi-delete",
      text: "삭제",
      color: "red",
      onClick: this.onMenuDelete,
    },
  ]);

  @Ref("base")
  readonly baseComponent!: GoodsItem;

  get baseProps(): GoodsItemProps {
    return this.baseComponent.$props as GoodsItemProps;
  }

  get normalizedId(): number {
    return (this.baseProps.goodsData || this.baseProps.combinationData)!.id;
  }

  @Emit("menu:duplicate")
  onMenuDuplicate(): number {
    return this.normalizedId;
  }

  @Emit("menu:delete")
  onMenuDelete(): number {
    return this.normalizedId;
  }
}
</script>

<style lang="scss">
.goods-item.manageable {
  $menu-activator-size: 3rem;

  .top-indicator {
    height: $menu-activator-size;
    padding-right: $menu-activator-size;

    &.click-to-edit {
      color: white;
      background: rgba(0, 0, 0, 0.5);
      -webkit-backdrop-filter: blur(0.5em);
              backdrop-filter: blur(0.5em);
      transform: translateY(-4rem);
      transition: transform var(--transition-duration) cubic-bezier(0, 0, 0, 1);
    }
  }

  &:hover .top-indicator.click-to-edit {
    transform: translateY(-0.005rem);
  }

  .menu {
    position: absolute;
    top: 0;
    right: 0;

    .menu-activator {
      width: $menu-activator-size;
      height: $menu-activator-size;

      text-shadow: 0 0 0.2em rgba(0, 0, 0, 0.75);
      opacity: 0.66;
    }
  }

  &:hover .menu .menu-activator {
    opacity: 1;
  }
}
</style>
