<template>
  <VSheet v-ripple
          class="goods-item no-selection d-flex ma-2"
          :class="{ 'combination-item': isCombination,
                    'disabled no-interaction': disabled,
                    'small': !displayMdAndUp,
                    'ma-md-4': forceSize !== 'small' }"
          rounded="lg"
          :elevation="elevation"
          :width="width"
          :height="height"
          @pointerenter="isHovering = true"
          @pointerleave="isHovering = false"
          @click.stop="onClick">
    <!-- *** Goods / Combination image *** -->
    <VImg class="goods-item-image no-interaction"
          :src="imageUrlComputed"
          cover />
    <div class="goods-item-image-overlay"></div>

    <!-- *** Top indicator *** -->
    <VSlideYTransition leave-absolute group>
      <div v-if="disabled && disabledReason"
           class="top-indicator">{{ disabledReason }}</div>
      <div v-if="!disabled && isCombination"
           class="top-indicator">세트 구성</div>

      <!-- *** Extra indicator slot for extensibility *** -->
      <slot v-if="!disabled" name="extra-top-indicator"></slot>
    </VSlideYTransition>

    <!-- *** Extra slot for extensibility *** -->
    <slot></slot>

    <!-- *** Bottom info area *** -->
    <VLayout class="d-flex flex-row align-self-end pa-2">
      <VLayout class="goods-info w-100 d-flex flex-column">
        <!-- Name -->
        <div class="name">
          <VIcon v-if="isCombination"
                 icon="mdi-set-all" />
          {{ normalizedData.name }}
        </div>

        <!-- Details -->
        <VLayout v-if="!hideDetails"
                 class="d-flex flex-row flex-wrap justify-space-between">
          <!-- Price -->
          <div class="price flex-0-0">
            <span v-if="isCombination" class="mr-1" style="font-size: smaller">세트</span>
            <span>{{ currencySymbol }}{{ normalizedData.price.toLocaleString() }}</span>
          </div>

          <!-- Stock -->
          <div v-if="!shouldHideStock" class="stock flex-1-0">
            <span class="remaining">{{ normalizedData.stockRemaining }}</span>

            <span v-if="shouldHideInitialStock"
                  class="remaining-text">개 남음</span>
            <span v-else
                  class="initial"> / {{ normalizedData.stockInitial }}</span>
          </div>
        </VLayout>
      </VLayout>
    </VLayout>
  </VSheet>
</template>

<script lang="ts">
import { GoodsStockVisibility } from "@myboothmanager/common";
import { Component, Emit, Prop, Setup, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import { isDisplayXXS } from "@/plugins/vuetify";
import { Goods, GoodsBase, GoodsCombination } from "@/entities";

export interface GoodsItemProps {
  readonly goodsData: GoodsBase;
  readonly currencySymbol: string;
  readonly disabled: boolean;
  readonly disabledReason?: string | null;
  readonly hideDetails: boolean;
  readonly forceStockVisibility?: GoodsStockVisibility | null;
  readonly forceSize: "auto" | "small" | "normal";
  readonly imageUrlResolver: (input: string | null | undefined) => string | null | undefined;
}

@Component({
  emits: ["click"],
})
export default class GoodsItem extends Vue implements GoodsItemProps {
  @Prop({ type: GoodsBase, required: true }) readonly goodsData!: GoodsBase;
  @Prop({ type: String,  default: "₩"    }) readonly currencySymbol!: string;
  @Prop({ type: Boolean, default: false  }) readonly disabled!: boolean;
  @Prop({ type: String,  default: null   }) readonly disabledReason?: string | null;
  @Prop({ type: Boolean, default: false  }) readonly hideDetails!: boolean;
  @Prop({ type: String,  default: null   }) readonly forceStockVisibility?: GoodsStockVisibility | null;
  @Prop({ type: String,  default: "auto" }) readonly forceSize!: "auto" | "small" | "normal";
  @Prop({ type: Function, default: (s: string) => s }) readonly imageUrlResolver!: (input: string | null | undefined) => string | null | undefined;

  readonly ELEVATION_NORMAL = 4;
  readonly ELEVATION_HOVER  = 8;
  readonly WIDTH_NORMAL     = 200;
  readonly WIDTH_SMALL      = 150;
  readonly HEIGHT_NORMAL    = 250;
  readonly HEIGHT_SMALL     = 150;

  @Setup(() => useDisplay().mdAndUp)
  declare displayMdAndUp: boolean;

  @Setup(() => useDisplay().width)
  declare displayWidth: number;

  isHovering: boolean = false;

  /**
   * Returns dynamic elevation
   */
  get elevation(): number {
    return this.isHovering ? this.ELEVATION_HOVER : this.ELEVATION_NORMAL;
  }

  /**
   * Returns dynamic width
   */
  get width(): number | string {
    if(this.forceSize === "normal") return this.WIDTH_NORMAL;
    else if(this.forceSize === "small") return this.WIDTH_SMALL;

    return this.displayMdAndUp
      ? this.WIDTH_NORMAL
      : (!isDisplayXXS(this.displayWidth) ? this.WIDTH_SMALL : "100%");
  }

  /**
   * Returns dynamic height
   */
  get height(): number | string {
    if(this.forceSize === "normal") return this.HEIGHT_NORMAL;
    else if(this.forceSize === "small") return this.HEIGHT_SMALL;

    return this.displayMdAndUp ? this.HEIGHT_NORMAL : this.HEIGHT_SMALL;
  }

  /**
   * Returns the normalized data for the goods or combination data.
   */
  get normalizedData() {
    return {
      id: this.goodsData.id,
      name: this.goodsData.name,
      description: this.goodsData.description,
      price: this.goodsData.price,
      stockInitial: this.goodsData.stockInitial,
      stockRemaining: this.goodsData.stockRemaining,
      stockVisibility: this.forceStockVisibility ?? this.goodsData.stockVisibility,
      imageUrl: this.isCombination ? (this.goodsData as GoodsCombination).combinationImageUrl : (this.goodsData as Goods).goodsImageUrl,
    };
  }

  /**
   * Returns whether the data is for a combination or not.
   */
  get isCombination(): boolean {
    return this.goodsData instanceof GoodsCombination;
  }

  /**
   * Returns the resolved representative image URL of the goods or combination.
   */
  get imageUrlComputed(): string {
    return this.imageUrlResolver(this.normalizedData.imageUrl) ?? ""; /* TODO: default image */
  }

  /**
   * Returns whether the stock details should be hidden or not.
   */
  get shouldHideStock(): boolean {
    return this.normalizedData.stockVisibility === GoodsStockVisibility.HIDE_ALL;
  }

  /**
   * Returns whether the initial stock information should be hidden or not.
   */
  get shouldHideInitialStock(): boolean {
    return this.normalizedData.stockVisibility !== GoodsStockVisibility.SHOW_ALL;
  }

  /**
   * Handle the click event on the goods item component.
   * Emits `click` event with the ID of the goods or combination.
   */
  @Emit("click")
  onClick(): number | null {
    if(this.disabled) return null;

    return this.normalizedData.id;
  }
}
</script>

<style lang="scss">
.goods-item {
  --transition-duration: 0.33s;

  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: box-shadow var(--transition-duration),
              transform var(--transition-duration) cubic-bezier(0, 0, 0, 1),
              opacity var(--transition-duration);
  will-change: transform;

  -webkit-backface-visibility: hidden;
          backface-visibility: hidden;

  background-color: black;

  &:hover {
    transform: translateY(-3.3%);
  }

  &.small {
    font-size: 90%;
  }

  .top-indicator {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    text-align: center;
    padding: 0.33em;
    font-size: 1.05em;
    font-weight: 500;
    word-break: keep-all;

    color: white;
    background-color: rgb(var(--v-theme-primary));
  }

  &.disabled {
    opacity: 0.75;

    .top-indicator {
      background-color: black;
    }
  }

  .goods-item-image {
    @mixin absolute-fill {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
    }
    @include absolute-fill;

    &-overlay {
      @include absolute-fill;
      background: linear-gradient(transparent 33%, rgba(0, 0, 0, 0.8));
    }
  }

  .goods-info {
    color: white;

    .name {
      display: -webkit-box;
      display:    -moz-box;
      display:         box;
      -webkit-line-clamp: 2;
              line-clamp: 2;
      -webkit-box-orient: vertical;
         -moz-box-orient: vertical;
              box-orient: vertical;

      overflow: hidden;
      word-break: keep-all;
      font-size: 1.25em;
      font-weight: 700;
    }

    .stock {
      text-align: right;
      margin-left: 0.5em;

      .remaining {
        font-weight: 600;

        &-text {
          font-weight: 300;
          font-size: 0.8em;
        }
      }

      .initial {
        font-weight: 300;
        font-size: 0.8em;
      }
    }
  }
}
</style>
