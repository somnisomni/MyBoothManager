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
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({})
export default class BoothMemberAvatar extends Vue {
  @Prop({ type: Object, default: null }) declare readonly avatarImage: IImageUploadInfo | null;
  @Prop({ type: String, default: undefined }) declare readonly size?: string;

  get imageUrl() {
    return this.$imageUrlResolver(this.avatarImage?.path);
  }
}
</script>
