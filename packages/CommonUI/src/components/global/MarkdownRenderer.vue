<template>
  <div v-if="renderAvailable && compiled"
       v-html="compiled"
       class="markdown" />
  <div v-else>
    <VProgressCircular v-if="!exposeSourceBeforeRender"
                      indeterminate />
    <pre v-else
         v-text="source"
         class="markdown" />
  </div>
</template>

<script lang="ts">
import { marked } from "marked";
import { Component, Prop, toNative, Vue } from "vue-facing-decorator";
import { createMarkedRenderer, DOMPURIFY_OPTIONS, resolveDOMPurify } from "@myboothmanager/common";

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
    return this.dompurify.sanitize(
      marked.parse(this.source, {
        gfm: true,
        async: false,
        breaks: true,
        renderer: this.markedRenderer,
      }), DOMPURIFY_OPTIONS);
  }
}

export default toNative(MarkdownRenderer);
</script>

<style lang="scss">
.markdown {
  line-height: 1.66;

  a {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding-bottom: 0.66em;
    margin-block: 0.25em;
    color: currentColor;
    transition: color 0.25s;

    &:hover {
      color: rgb(var(--v-theme-primary));  // vuetify primary color
    }

    &:before {
      content: "\F0339";  // mdi-link-variant
      font-family: "Material Design Icons";
      margin-right: 0.25em;
    }

    &:after {
      content: attr(href);
      position: absolute;
      bottom: 0;
      font-size: 0.66em;
      opacity: 0.5;

      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
