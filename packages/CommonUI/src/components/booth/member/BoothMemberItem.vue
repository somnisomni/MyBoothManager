<template>
  <VSheet class="d-inline-flex flex-row align-center pa-2 pr-6 ma-4 bg-background text-start rounded-s-pill"
          :style="{ 'cursor': editable ? 'pointer' : 'default' }"
          v-ripple
          height="7em"
          max-height="7em"
          :max-width="maxWidth"
          @click="$emit('click', memberData.id)">
    <VAvatar size="6em"
             class="no-interaction">
      <VImg v-if="avatarImageUrl"
            :src="avatarImageUrl"
            :lazy-src="memberData.avatarImage?.thumbnailData" />
      <VIcon v-else
             icon="mdi-account"
             size="3em" />
    </VAvatar>

    <div class="d-flex flex-column ml-4 overflow-hidden">
      <div class="d-flex align-center" style="white-space: nowrap">
        <span style="font-size: 1.25em; overflow: hidden; word-break: keep-all; text-overflow: ellipsis"><strong :title="memberData.name">{{ memberData.name }}</strong></span>
        <span v-if="memberData.role" class="ml-1 flex-shrink-0 text-subtitle-1"> - {{ memberData.role }}</span>
      </div>
      <div v-if="memberData.descriptionShort" class="description" :title="memberData.descriptionShort">{{ memberData.descriptionShort }}</div>

      <div>
        <VBtn v-if="memberData.url" :href="memberData.url" target="_blank" icon variant="flat" size="28px" @click.stop>
          <VIcon size="24px">mdi-web</VIcon>
          <VTooltip activator="parent" location="bottom" transition="fade-transition">{{ memberData.url }}</VTooltip>
        </VBtn>
      </div>
    </div>
  </VSheet>
</template>

<script lang="ts">
import type { IBoothMember } from "@myboothmanager/common";
import { Component, Prop, Setup, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";

@Component({
  emits: ["click"],
})
export default class BoothMemberItem extends Vue {
  @Prop({ type: Object,  required: true }) readonly memberData!: IBoothMember;
  @Prop({ type: Boolean, default: false }) readonly editable!: boolean;
  @Prop({ type: Function, default: (s: string) => s }) readonly imageUrlResolver!: (rawImageUrl?: string | null) => string | null | undefined;

  @Setup(() => useDisplay().smAndUp)
  declare smAndUp: boolean;

  get maxWidth(): number | string {
    return this.smAndUp ? "24em" : "100%";
  }

  get avatarImageUrl() {
    return this.imageUrlResolver(this.memberData.avatarImage?.path);
  }
}
</script>

<style lang="scss" scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
