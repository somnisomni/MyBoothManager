<template>
  <VSheet class="d-inline-flex flex-row align-center pa-2 pr-6 ma-4 bg-background text-start"
          :class="{ 'rounded-s-pill': hasMemberImage }"
          :style="{ 'cursor': editable ? 'pointer' : 'default' }"
          v-ripple
          height="7em"
          max-height="7em"
          max-width="24em"
          @click="$emit('click', member.id)">
    <VAvatar v-if="member.memberImageUrl" :image="getUploadFilePath(member.memberImageUrl)" size="6em" class="no-interaction" />

    <div class="d-flex flex-column ml-2">
      <div class="d-flex">
        <span style="font-size: 1.25em; overflow: hidden; word-break: keep-all; text-overflow: ellipsis"><strong :title="member.name">{{ member.name }}</strong></span>
        <span class="flex-shrink-0 text-subtitle-1">- {{ member.role }}</span>
      </div>
      <div v-if="member.descriptionShort" class="description" :title="member.descriptionShort">{{ member.descriptionShort }}</div>

      <div>
        <VBtn v-if="member.url" :href="member.url" target="_blank" icon variant="flat" size="28px" @click.stop>
          <VIcon size="24px">mdi-web</VIcon>
          <VTooltip activator="parent" location="bottom">{{ member.url }}</VTooltip>
        </VBtn>
      </div>
    </div>
  </VSheet>
</template>

<script lang="ts">
import type { IBoothMember } from "@myboothmanager/common";
import { Component, Prop, Vue } from "vue-facing-decorator";
import { getUploadFilePath } from "@/lib/functions";

@Component({
  emits: ["click"],
})
export default class BoothMemberItem extends Vue {
  readonly getUploadFilePath = getUploadFilePath;

  @Prop({ type: Object, required: true }) member!: IBoothMember;
  @Prop({ type: Boolean, default: false }) editable!: boolean;

  get hasMemberImage() {
    return !!this.member.memberImageUrl;
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
