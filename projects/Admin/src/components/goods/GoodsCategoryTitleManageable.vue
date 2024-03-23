<template>
  <GoodsCategoryTitle>
    <template #text="{ categoryData }">
      <VBtn class="d-flex flex-row flex-0-0 align-center justify-start text-left px-2"
            variant="text"
            size="large"
            @click.stop="onClick((categoryData as IGoodsCategory).id)"
            @pointerenter="isHovering = true"
            @pointerleave="isHovering = false">
        <h2 class="d-inline-block">{{ (categoryData as IGoodsCategory).name }}</h2>

        <VSlideXTransition>
          <VIcon v-show="isHovering" class="ml-2" icon="mdi-pencil" />
        </VSlideXTransition>
      </VBtn>
    </template>
  </GoodsCategoryTitle>
</template>

<script lang="ts">
import type { IGoodsCategory } from "@myboothmanager/common";  // eslint-disable-line @typescript-eslint/no-unused-vars
import { Component, Emit, Vue } from "vue-facing-decorator";

@Component({
  emits: ["click"],
})
export default class GoodsCategoryTitleManageable extends Vue {
  isHovering: boolean = false;

  @Emit("click")
  onClick(categoryId: number) {
    return categoryId;
  }
}
</script>
