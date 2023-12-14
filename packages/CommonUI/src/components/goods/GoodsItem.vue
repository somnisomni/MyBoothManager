<template>
  <VSheet class="goods-item no-selection d-flex ma-2 ma-md-4"
          :class="{ 'edit': editable, 'sm': !mdAndUp }"
          :width="width"
          :height="height"
          rounded="lg"
          v-ripple
          :elevation="elevation"
          @pointerenter="isHovering = true"
          @pointerleave="isHovering = false"
          @click.stop="onItemClick">
    <VImg class="goods-image" :src="goodsImageUrlComputed" cover />
    <div class="goods-image-overlay"></div>

    <div v-if="editable" class="click-to-edit-text"><VIcon>mdi-pencil</VIcon> 클릭하여 수정</div>

    <VLayout class="goods-info d-flex flex-column align-self-end pa-2">
      <div class="name">{{ goodsData.name }}</div>

      <VLayout class="d-flex flex-row justify-space-between">
        <div>{{ currencySymbol }}{{ goodsData.price.toLocaleString() }}</div>
        <div><span class="goods-stock-current">{{ goodsData.stockRemaining }}</span> <span class="goods-stock-initial">/ {{ goodsData.stockInitial }}</span></div>
      </VLayout>
    </VLayout>
  </VSheet>
</template>

<script lang="ts">
import type { IGoods } from "@myboothmanager/common";
import { Vue, Component, Prop, Emit } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { unref } from "vue";
import { isDisplayXXS } from "@/plugins/vuetify";

@Component({
  emits: ["click", "editRequest"],
})
export default class GoodsItem extends Vue {
  @Prop({ type: Object, required: true }) goodsData!: IGoods;
  @Prop({ type: String, default: null  }) goodsImageUrl!: string | null;
  @Prop({ type: String, required: true }) currencySymbol!: string;
  @Prop({ type: Boolean, default: true }) editable!: boolean;

  readonly ELEVATION_NORMAL = 4;
  readonly ELEVATION_HOVER  = 8;
  readonly WIDTH_NORMAL  = 200;
  readonly HEIGHT_NORMAL = 250;
  readonly WIDTH_SMALL   = 150;
  readonly HEIGHT_SMALL  = 150;

  isHovering: boolean = false;

  get mdAndUp(): boolean {
    return unref(useDisplay().mdAndUp);
  }

  get elevation(): number { return this.isHovering ? this.ELEVATION_HOVER : this.ELEVATION_NORMAL; }
  get width(): number | string {
    return this.mdAndUp ? this.WIDTH_NORMAL : (!isDisplayXXS() ? this.WIDTH_SMALL : "100%");
  }
  get height(): number { return this.mdAndUp ? this.HEIGHT_NORMAL : this.HEIGHT_SMALL; }

  get goodsImageUrlComputed(): string {
    return this.goodsImageUrl ?? (this.goodsData.goodsImageUrl ?? `https://picsum.photos/seed/${this.goodsData.id}/200/200`);
  }

  @Emit("click")
  onItemClick() {
    if(this.editable) this.$emit("editRequest", this.goodsData.id);
    return this.goodsData.id;
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  $transition-duration: 0.33s;

  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow $transition-duration, transform $transition-duration cubic-bezier(0, 0, 0, 1);

  &:hover {
    transform: translateY(-3.3%);
  }

  &.sm {
    font-size: 90%;
  }

  .click-to-edit-text {
    position: absolute;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.5em);
    width: 100%;
    text-align: center;
    left: 0;
    right: 0;
    top: 0;
    padding: 0.5em 0;
    font-size: 1.25em;
    font-weight: 500;
    transform: translateY(-4rem);
    transition: transform $transition-duration cubic-bezier(0, 0, 0, 1);
  }

  &.edit:hover .click-to-edit-text {
    transform: translateY(-0.05rem);
  }

  .goods-image {
    pointer-events: none;

    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;

    -webkit-user-drag: none;
            user-drag: none;

    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .goods-image-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(transparent 33%, rgba(0, 0, 0, 0.8));
  }

  .goods-info {
    color: white;

    .name {
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
              line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: keep-all;

      font-size: 1.25em;
      font-weight: 700;
    }

    .goods-stock-current {
      font-weight: 600;
    }

    .goods-stock-initial {
      font-weight: 300;
      font-size: 0.8em;
    }
  }
}
</style>
