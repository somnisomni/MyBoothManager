<template>
  <VContainer>
    <VueMarkdown :source="helpPageSource" />
  </VContainer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-facing-decorator";
import VueMarkdown from "vue-markdown-render";

@Component({
  components: {
    VueMarkdown,
  },
})
export default class HelpPage extends Vue {
  helpPageSource: string = "";

  get helpPageName() {
    return this.$route.params.name as string ?? "index";
  }

  @Watch("helpPageName", { immediate: true })
  async onHelpPageNameChanged() {
    this.helpPageSource = (await import(`./markdown/${this.helpPageName}.md?raw`) as { default: string }).default;
    console.log(this.helpPageSource);
  }
}
</script>
