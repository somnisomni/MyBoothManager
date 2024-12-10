<template>
  <div v-html="compiled" class="markdown"></div>
</template>

<script lang="ts">
import { marked } from "marked";
import { Component, Prop, toNative, Vue } from "vue-facing-decorator";
import DOMPurify from "isomorphic-dompurify";

@Component({})
export class MarkdownRenderer extends Vue {
  @Prop({ type: String, required: true }) declare readonly source: string;

  get compiled() {
    return DOMPurify.sanitize(
      marked.parse(this.source, {
        gfm: true,
        async: false,
        breaks: true,
      }), {
        FORBID_TAGS: ["script", "noscript", "style", "img", "picture", "video", "audio", "iframe", "button", "input", "form", "embed", "applet", "canvas", "svg", "html", "head", "body", "meta", "link", "frame", "frameset", "title", "source", "template"],
        SANITIZE_DOM: true,
      });
  }
}

export default toNative(MarkdownRenderer);
</script>

<style lang="scss">
.markdown {
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
