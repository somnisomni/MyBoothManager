<template>
  <VSheet v-ripple
          class="d-inline-flex flex-row align-center pa-2 pr-6 ma-4 bg-background text-start rounded-s-pill"
          :style="{ 'cursor': editable ? 'pointer' : 'default' }"
          height="7em"
          maxHeight="7em"
          :maxWidth="maxWidth"
          @click="$emit('click', memberData.id)">
    <BoothMemberAvatar :avatarImage="memberData.avatarImage"
                       size="6em" />

    <div class="d-flex flex-column ml-4 overflow-hidden">
      <div class="d-flex align-center"
           style="white-space: nowrap">
        <span style="font-size: 1.25em; overflow: hidden; word-break: keep-all; text-overflow: ellipsis">
          <strong :title="memberData.name">{{ memberData.name }}</strong>
        </span>

        <span v-if="memberData.role"
              class="ml-1 flex-shrink-0 text-subtitle-1"> - {{ memberData.role }}</span>
      </div>
      <div v-if="memberData.descriptionShort"
           class="description"
           :title="memberData.descriptionShort">
        <span>{{ memberData.descriptionShort }}</span>
      </div>

      <div>
        <VBtn v-if="memberData.url"
              :href="memberData.url"
              target="_blank"
              icon
              variant="flat"
              size="28px"
              @click.stop>
          <VIcon size="24px"
                 icon="mdi-web" />

          <VTooltip activator="parent"
                    location="bottom"
                    transition="fade-transition">
            <span>{{ memberData.url }}</span>
          </VTooltip>
        </VBtn>
      </div>
    </div>
  </VSheet>
</template>

<script lang="ts">
import type { IBoothMember } from "@myboothmanager/common";
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
  @Prop({ type: Object, required: true }) declare readonly memberData: IBoothMember;
  @Prop({ type: Boolean, default: false }) declare readonly editable: boolean;

  @Setup(() => useDisplay().smAndUp)
  declare smAndUp: boolean;

  get maxWidth(): number | string {
    return this.smAndUp ? "24em" : "100%";
  }
}

export default toNative(BoothMemberItem);
</script>

<style lang="scss" scoped>
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
          line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
