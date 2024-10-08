<template>
  <section>
    <!-- Booth image & info area -->
    <VSheet class="booth-info-section">
      <VParallax class="booth-image d-flex align-end bg-white"
                 :src="bannerImageUrl"
                 scale="0.8">
        <div class="booth-image-overlay"></div>

        <VContainer>
          <VLayout class="booth-info-content w-100 d-flex flex-row align-end pa-2 pa-sm-4">
            <VLayout class="d-flex flex-column flex-1-1"
                     style="max-width: 100%">
              <h4 v-if="boothData.boothNumber" class="d-sm-none text-h4 mb-2">{{ boothData.boothNumber }}</h4>
              <h3 class="text-h3 font-weight-bold mb-2">{{ boothData.name }}</h3>
              <div v-if="boothData.description" class="text-subtitle-1" style="font-size: 1.125rem !important; line-height: 1.25;">{{ boothData.description }}</div>
              <div class="text-overline mt-4"
                   style="line-height: 1.33;">
                <div v-if="stringifiedOpenDates">{{ stringifiedOpenDates }}</div>
                <span> @ </span>
                <span v-if="boothData.fair">{{ boothData.fair.name }} - </span>
                <span>{{ boothData.location }}</span>
              </div>
            </VLayout>
            <VLayout v-if="boothData.boothNumber"
                     class="d-none d-sm-flex flex-column flex-0-0 text-center"
                     style="max-width: 33.3333%;">
              <div class="text-subtitle-1">부스 번호</div>
              <h2 class="text-h2 pa-2">{{ boothData.boothNumber }}</h2>
            </VLayout>
          </VLayout>
        </VContainer>
      </VParallax>
    </VSheet>

    <!-- Booth open status area -->
    <VScrollXTransition leave-absolute>
      <VSheet      v-if="boothData.status.status === BoothStatus.OPEN"    class="booth-status-section pa-2" color="blue"           >정상 운영 중!</VSheet>
      <VSheet v-else-if="boothData.status.status === BoothStatus.CLOSE"   class="booth-status-section pa-2" color="red-darken-1"   >운영을 종료한 부스입니다.</VSheet>
      <VSheet v-else-if="boothData.status.status === BoothStatus.PAUSE"   class="booth-status-section pa-2" color="orange-darken-1">운영이 일시 중지되었습니다.<br /><span v-if="boothData.status.reason">사유 : {{ boothData.status.reason }}</span></VSheet>
      <VSheet v-else-if="boothData.status.status === BoothStatus.PREPARE" class="booth-status-section pa-2" color="green"          >준비 중인 부스입니다.</VSheet>
    </VScrollXTransition>
  </section>
</template>

<script lang="ts">
import { BoothStatus, type IBooth } from "@myboothmanager/common";
import { Prop, Vue } from "vue-facing-decorator";
import { getUploadFileUrl } from "#imports";

@NuxtComponent({})
export default class BoothInfoSection extends Vue {
  readonly BoothStatus = BoothStatus;

  @Prop({ type: Object, required: true }) boothData!: IBooth;

  get bannerImageUrl() {
    return getUploadFileUrl(this.boothData.bannerImage?.path);
  }

  get stringifiedOpenDates() {
    if(this.boothData.fair && this.boothData.datesOpenInFair) {
      const dates = this.boothData.datesOpenInFair
        .map((date) => new Date(date).toLocaleDateString())
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

      return dates.join(", ");
    } else if(this.boothData.dateOpen && this.boothData.dateClose) {
      const dates = [
        new Date(this.boothData.dateOpen).toLocaleDateString(),
        new Date(this.boothData.dateClose).toLocaleDateString(),
      ];

      return dates.join(" ~ ");
    }

    return null;
  }
}
</script>

<style lang="scss" scoped>
.booth-info-section {
  --booth-info-section-height: 300px;

  position: relative;
  width: 100%;
  height: var(--booth-info-section-height);

  .booth-image {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .booth-image-overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.33) 33%, rgba(0, 0, 0, 1));
  }

  .booth-info-content {
    color: white;
    z-index: 1;
  }
}

.booth-status-section {
  width: 100%;
  text-align: center;
  font-weight: bold;
}
</style>
