<template>
  <div v-if="renderAvailable && compiled"
       v-html="compiled"
       class="markdown" />
  <div v-else>
    <VProgressCircular v-if="!exposeSourceBeforeRender && source.length > 0"
                      indeterminate />
    <pre v-else
         v-text="source"
         class="markdown" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, toNative, Vue } from "vue-facing-decorator";
import { createMarkedRenderer, renderAndSanitizeMarkdown, resolveDOMPurify } from "@myboothmanager/common";

/**
 * Markdown renderer component using `marked` and `DOMPurify`.
 *
 * This component is client-side only. If this component is used on server-side, the content of `source` prop will be rendered as-is (Markdown will not be rendered into HTML too).
 */
@Component({})
export class MarkdownRenderer extends Vue {
  @Prop({ type: String, required: true }) declare readonly source: string;
  @Prop({ type: Boolean, default: false }) declare readonly exposeSourceBeforeRender: boolean;

  renderAvailable = false;
  private dompurify = resolveDOMPurify();
  private readonly markedRenderer = createMarkedRenderer();

  mounted() {
    // onMounted hook is only called on client-side according to https://nuxt.com/docs/api/advanced/hooks

    // Try to re-resolve DOMPurify after window object is changed
    this.dompurify = resolveDOMPurify();
    this.renderAvailable = !!this.dompurify;
  }

  get compiled(): string | null {
    if(!this.dompurify) {
      this.renderAvailable = false;
      return null;
    }

    this.renderAvailable = true;
    return renderAndSanitizeMarkdown(this.source, {
      dompurify: this.dompurify,
      markedRenderer: this.markedRenderer,
    });
  }
}

export default toNative(MarkdownRenderer);
</script>

<style lang="scss">
.markdown {
  line-height: 1.66;

  a {
    position: relative;
    display: inline;
    text-decoration: none;
    padding-bottom: 0;
    margin-block: 0.25em;
    margin-bottom: 0;
    border-bottom: solid 1px currentColor;
    color: currentColor;
    transition: color 0.33s, margin-bottom 0.33s cubic-bezier(0, 0, 0, 1);

    &::before {
      content: "\F0339";  // mdi-link-variant
      font-family: "Material Design Icons";
      margin-right: 0.25em;
    }

    &::after {
      content: attr(href);
      position: absolute;
      top: 120%;
      left: 0;
      right: 0;
      font-size: 0.66em;
      text-align: center;
      background-color: rgba(var(--v-theme-background), 1.0);
      box-shadow: 0 0 0.5em currentColor;
      border-radius: 99999px;
      z-index: 1;

      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      pointer-events: none;
      opacity: 0;
      transform: translateY(-50%);
      transition: opacity 0.33s cubic-bezier(0, 0, 0, 1), transform 0.33s cubic-bezier(0, 0, 0, 1);
    }

    &:hover {
      color: rgb(var(--v-theme-primary));  // vuetify primary color
      margin-bottom: 0.66em;

      &::after {
        pointer-events: initial;
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-block: 0.25em;
  }

  ul, ol {
    text-align: start;
    list-style-position: outside;
    margin-block: 0.5em;
    padding-inline-start: 2em;
  }

  blockquote {
    text-align: start;
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
