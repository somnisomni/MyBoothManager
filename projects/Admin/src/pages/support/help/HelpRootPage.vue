<template>
  <VContainer>
    <MarkdownRenderer :source="helpPageSource" />
  </VContainer>
</template>

<script lang="ts">
import { Vue, Component, Watch , toNative } from "vue-facing-decorator";
import { useRoute } from "vue-router";

@Component({})
class HelpPage extends Vue {
  helpPageSource: string = "";

  get helpPageName() {
    return useRoute().params.name as string ?? "index";
  }

  @Watch("helpPageName", { immediate: true })
  async onHelpPageNameChanged() {
    this.helpPageSource = (await import(`./markdown/${this.helpPageName}.md?raw`) as { default: string }).default;
  }
}

export default toNative(HelpPage);
</script>
