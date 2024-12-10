<template>
  <VAvatar class="no-interaction"
           :size="size">
    <VImg v-if="avatarImage"
          :src="imageUrl ?? undefined"
          :lazy-src="avatarImage.thumbnailData ?? undefined" />
    <VIcon v-else
           icon="mdi-account"
           size="3em" />
  </VAvatar>
</template>

<script lang="ts">
import type { IImageUploadInfo } from "@myboothmanager/common";
import type { ComponentCustomProperties } from "vue";
import { Component, Prop, toNative, Vue } from "vue-facing-decorator";

@Component({})
export class BoothMemberAvatar extends Vue {
  @Prop({ type: Object, default: null }) declare readonly avatarImage: IImageUploadInfo | null;
  @Prop({ type: String, default: undefined }) declare readonly size?: string;

  // FIXME: FUCK SHIT TYPE DECLARATION IN `index.ts` IS NOT WORKING IN THIS SCOPE
  // I DON'T KNOW WHAT'S THE PROBLEM. I TRIED EVERYTHING AT THIS MOMENT
  // If this somewhat fixed later, simply remove this declare statement
  declare readonly $imageUrlResolver: ComponentCustomProperties["$imageUrlResolver"];

  get imageUrl() {
    return this.$imageUrlResolver(this.avatarImage?.path);
  }
}

export default toNative(BoothMemberAvatar);
</script>
