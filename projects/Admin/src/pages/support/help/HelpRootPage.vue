<template>
  <VContainer>
    <VueMarkdown id="markdown-root"
                 :source="helpPageSource"
                 :options="{ html: true }" />
  </VContainer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-facing-decorator";
import VueMarkdown from "vue-markdown-render";
import { useRoute } from "vue-router";

@Component({
  components: {
    VueMarkdown,
  },
})
export default class HelpPage extends Vue {
  helpPageSource: string = "";

  get helpPageName(): string {
    return useRoute().params.name as string ?? "index";
  }

  @Watch("helpPageName", { immediate: true })
  async onHelpPageNameChanged(): Promise<void> {
    this.helpPageSource = (await import(`./markdown/${this.helpPageName}.md?raw`) as { default: string }).default;
  }
}
</script>

<style lang="scss">
#markdown-root {
  line-height: 1.66;

  h2, h3, h4, h5, h6 {
    margin-block-start: 0.75em;
  }

  ul, ol {
    list-style-position: outside;
    margin-block: 0.5em;
    padding-inline-start: 2em;
  }

  blockquote {
    padding-inline-start: 0.5em;
    color: gray;
    border-left: 0.25em solid currentColor;
  }

  table {
    border-collapse: collapse;

    th, td {
      padding: 0.25em 0.5em;
      border: 1px solid rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
