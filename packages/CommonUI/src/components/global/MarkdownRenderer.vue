<template>
  <div v-html="compiled" class="markdown"></div>
</template>

<script lang="ts">
import { marked, Renderer } from "marked";
import { Component, Prop, toNative, Vue } from "vue-facing-decorator";
import { default as DOMPurify } from "dompurify";
import { resolveDOMPurify } from "@/plugins/isomorphic-dompurify";

function createMarkedCustomRenderer(): Renderer {
  const renderer = new Renderer();

  // Add target="_blank" to anchors(links)
  const rendererLink = renderer.link;
  renderer.link = (link) => {
    const html = rendererLink.call(renderer, link);
    return html.replace(/^<a /, "<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" ");
  };

  return renderer;
}

@Component({})
export class MarkdownRenderer extends Vue {
  @Prop({ type: String, required: true }) declare readonly source: string;

  markedRenderer = createMarkedCustomRenderer();
  dompurify: typeof DOMPurify | null = null;

  async mounted() {
    await this.$nextTick();

    this.dompurify = (await resolveDOMPurify()).dompurify;
  }

  get compiled() {
    if(!this.dompurify) return this.source;

    return this.dompurify.sanitize(
      marked.parse(this.source, {
        gfm: true,
        async: false,
        breaks: true,
        renderer: this.markedRenderer,
      }), {
        FORBID_TAGS: ["script", "noscript", "style", "img", "picture", "video", "audio", "iframe", "button", "input", "form", "embed", "applet", "canvas", "svg", "html", "head", "body", "meta", "link", "frame", "frameset", "title", "source", "template"],
        ADD_ATTR: ["target"],
        SANITIZE_DOM: true,
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
