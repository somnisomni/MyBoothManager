<template>
  <VSheet class="booth-member-item d-inline-flex flex-row align-center pa-2 pr-6 ma-4 bg-background text-start rounded-s-pill"
          :style="{ 'cursor': editable ? 'pointer' : 'default' }"
          v-ripple
          :max-width="maxWidth"
          @click="$emit('click', memberData.id)">
    <BoothMemberAvatar :avatarImage="memberData.avatarImage"
                       size="6em" />

    <div class="d-flex flex-column ml-4 py-1 overflow-hidden">
      <div class="ellipsis font-weight-bold"
           style="font-size: 1.25em; word-break: keep-all"
           :title="memberData.name">{{ memberData.name }}</div>
      <div v-if="memberData.role"
           class="ellipsis text-subtitle-2 text-grey-darken-1">{{ memberData.role }}</div>
      <div v-if="memberData.descriptionShort"
           class="description ellipsis mt-1"
           :title="memberData.descriptionShort">{{ memberData.descriptionShort }}</div>

      <div class="mt-1">
        <VBtn v-if="memberData.url"
              :href="memberData.url"
              target="_blank"
              icon
              variant="flat"
              size="28px"
              @click.stop>
          <div v-if="simpleIcon && simpleIcon !== 'mail'"
               class="v-icon"
               style="font-size: 20px; width: 20px; height: 20px"
               v-html="simpleIcon.svg" />
          <VIcon v-else
                 size="20px"
                 :icon="simpleIcon === 'mail' ? 'mdi-email' : 'mdi-web'" />
          <VTooltip activator="parent"
                    location="bottom"
                    transition="fade-transition">{{ memberData.url }}</VTooltip>
        </VBtn>
      </div>
    </div>
  </VSheet>
</template>

<script lang="ts">
import type { IBoothMember } from "@myboothmanager/common";
import { getSimpleIconByUrl } from "@myboothmanager/common";
import { Component, Prop, Setup, toNative, Vue } from "vue-facing-decorator";
import { useDisplay } from "vuetify";
import BoothMemberAvatar from "./BoothMemberAvatar.vue";

@Component({
  components: {
    BoothMemberAvatar,
  },
  emits: [ "click" ],
})
export class BoothMemberItem extends Vue {
  @Prop({ type: Object,  required: true }) declare readonly memberData: IBoothMember;
  @Prop({ type: Boolean, default: false }) declare readonly editable: boolean;

  @Setup(() => useDisplay().smAndUp)
  declare smAndUp: boolean;

  get maxWidth(): number | string {
    return this.smAndUp ? "24em" : "100%";
  }

  get simpleIcon(): ReturnType<typeof getSimpleIconByUrl> {
    return this.memberData.url ? getSimpleIconByUrl(this.memberData.url) : null;
  }
}

export default toNative(BoothMemberItem);
</script>

<style lang="scss" scoped>
.booth-member-item {
  min-height: 7em;
  max-height: 10em;

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
            line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
}
</style>
