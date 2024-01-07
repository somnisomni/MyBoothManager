<template>
  <VSheet class="goods-item no-selection d-flex ma-2"
          :class="{ 'hover': isHovering || isSelected,
                    'selectable': selectable,
                    'selected': selectable && isSelected,
                    'edit': editable,
                    'combination-item': isGoodsCombination,
                    'sm': !mdAndUp,
                    'ma-md-4': !forceSmallSize }"
          :width="width"
          :height="height"
          rounded="lg"
          v-ripple
          :elevation="elevation"
          @pointerenter="isHovering = true"
          @pointerleave="isHovering = false"
          @click.stop="onItemClick">
    <VImg class="representative-image no-interaction" :src="representativeImageUrlComputed" cover />
    <div class="representative-image-overlay"></div>

    <div v-if="isGoodsCombination" class="top-indicator goods-combination-indicator">세트 구성</div>
    <div v-if="editable" class="top-indicator click-to-edit-text"><VIcon>mdi-pencil</VIcon> 클릭하여 수정</div>
    <VSlideYTransition leave-absolute>
      <div v-if="isSelected" class="top-indicator selected-indicator"><VIcon>mdi-check</VIcon> 선택됨</div>
    </VSlideYTransition>

    <VLayout class="goods-info d-flex flex-column align-self-end pa-2">
      <div class="name"><VIcon v-if="isGoodsCombination">mdi-set-all</VIcon> {{ normalizedData.name }}</div>

      <VLayout v-if="!showNameOnly" class="d-flex flex-row flex-wrap justify-space-between">
        <div class="flex-0-0">{{ isGoodsCombination ? "세트" : "" }} {{ currencySymbol }}{{ normalizedData.price.toLocaleString() }}</div>
        <div class="flex-1-0 text-right">
          <span v-if="normalizedData.stockVisibility !== GoodsStockVisibility.HIDE_ALL" class="goods-stock-current">{{ normalizedData.stockRemaining }}</span>
          <span v-if="normalizedData.stockVisibility === GoodsStockVisibility.SHOW_ALL" class="goods-stock-initial"> / {{ normalizedData.stockInitial }}</span>
        </div>
      </VLayout>
    </VLayout>
  </VSheet>
</template>

<script lang="ts">
import { GoodsStockVisibility, type IGoods, type IGoodsCombination } from "@myboothmanager/common";
import { Vue, Component, Prop, Emit, Model } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { unref } from "vue";
import { isDisplayXXS } from "@/plugins/vuetify";

@Component({
  emits: ["click", "editRequest"],
})
export default class GoodsItem extends Vue {
  readonly GoodsStockVisibility = GoodsStockVisibility;

  @Model({ type: Boolean, default: false }) isSelected!: boolean;
  @Prop({ type: Object }) goodsData!: IGoods | null | undefined;
  @Prop({ type: Object }) combinationData!: IGoodsCombination | null | undefined;
  @Prop({ type: String, default: null  }) representativeImageUrl!: string | null;
  @Prop({ type: String, required: true }) currencySymbol!: string;
  @Prop({ type: Boolean, default: false }) editable!: boolean;
  @Prop({ type: Boolean, default: false }) selectable!: boolean;
  @Prop({ type: Boolean, default: false }) forceSmallSize!: boolean;
  @Prop({ type: Boolean, default: false }) showNameOnly!: boolean;

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

  get elevation(): number {
    return this.isHovering || (this.selectable && this.isSelected) ? this.ELEVATION_HOVER : this.ELEVATION_NORMAL;
  }
  get width(): number | string {
    return this.mdAndUp && !this.forceSmallSize ? this.WIDTH_NORMAL : (!isDisplayXXS() ? this.WIDTH_SMALL : "100%");
  }
  get height(): number {
    return this.mdAndUp && !this.forceSmallSize ? this.HEIGHT_NORMAL : this.HEIGHT_SMALL;
  }

  get isGoodsCombination(): boolean {
    return !!this.combinationData;
  }

  get representativeImageUrlComputed(): string {
    return this.representativeImageUrl ?? (this.normalizedData.representativeImageUrl ?? `https://picsum.photos/seed/${this.normalizedData.id}/200/200`);
  }

  get normalizedData() {
    return {
      id: (this.isGoodsCombination ? this.combinationData!.id : this.goodsData!.id),
      name: (this.isGoodsCombination ? this.combinationData!.name : this.goodsData!.name),
      description: (this.isGoodsCombination ? this.combinationData!.description : this.goodsData!.description),
      price: (this.isGoodsCombination ? this.combinationData!.price : this.goodsData!.price),
      stockInitial: (this.isGoodsCombination ? this.combinationData!.stockInitial : this.goodsData!.stockInitial),
      stockRemaining: (this.isGoodsCombination ? this.combinationData!.stockRemaining : this.goodsData!.stockRemaining),
      stockVisibility: (this.isGoodsCombination ? this.combinationData!.stockVisibility : this.goodsData!.stockVisibility),
      representativeImageUrl: (this.isGoodsCombination ? this.combinationData!.combinationImageUrl : this.goodsData!.goodsImageUrl),
    };
  }

  @Emit("click")
  onItemClick() {
    if(this.selectable) this.isSelected = !this.isSelected;
    if(this.editable) this.$emit("editRequest", this.normalizedData.id);
    return this.normalizedData.id;
  }
}
</script>

<style lang="scss" scoped>
.goods-item {
  $transition-duration: 0.33s;

  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow $transition-duration, transform $transition-duration cubic-bezier(0, 0, 0, 1), opacity $transition-duration;
  will-change: transform;
  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;

  &.hover {
    transform: translateY(-3.3%);
  }

  &.sm {
    font-size: 90%;
  }

  &.selectable {
    opacity: 0.75;

    &.selected { opacity: 1; }
  }

  .top-indicator {
    position: absolute;
    width: 100%;
    text-align: center;
    left: 0;
    right: 0;
    top: 0;
    padding: 0.5em 0;
    font-size: 1.2em;
    font-weight: 500;
  }

  .goods-combination-indicator {
    color: white;
    background: rgb(255, 128, 64);
  }

  .selected-indicator {
    color: white;
    background: rgba(var(--v-theme-success), 0.9);
  }

  .click-to-edit-text {
    color: white;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.5em);
    transform: translateY(-4rem);
    transition: transform $transition-duration cubic-bezier(0, 0, 0, 1);
  }

  &.edit:hover .click-to-edit-text {
    transform: translateY(-0.05rem);
  }


  .representative-image {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .representative-image-overlay {
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
