import type { Config, WindowLike } from "dompurify";
import DOMPurify from "dompurify";
import { marked, Renderer, type MarkedOptions } from "marked";

/* `marked` and `dompurify` package needs to be declared in `dependencies` in `package.json` of dependents */

export const DOMPURIFY_OPTIONS: Config = {
  FORBID_TAGS: [
    "script",
    "noscript",
    "style",
    "img",
    "picture",
    "video",
    "audio",
    "iframe",
    "button",
    "input",
    "form",
    "embed",
    "applet",
    "canvas",
    "svg",
    "html",
    "head",
    "body",
    "meta",
    "link",
    "frame",
    "frameset",
    "title",
    "source",
    "template",
  ],
  ADD_ATTR: ["target"],
  SANITIZE_DOM: true,
};

export const MARKED_OPTIONS: MarkedOptions = {
  gfm: true,
  breaks: true,
};

export function createMarkedRenderer(): Renderer {
  const renderer = new Renderer();

  // Add target="_blank" to anchors(links)
  const rendererLink = renderer.link;
  renderer.link = (link) => {
    const html = rendererLink.call(renderer, link);
    return html.replace(/^<a /, "<a target=\"_blank\" rel=\"noopener noreferrer nofollow\" ");
  };

  return renderer;
}

export function resolveDOMPurify(root?: WindowLike): typeof DOMPurify | null {
  const rootWindow = root ?? (typeof window !== "undefined" ? window : null);
  if(!rootWindow) {
    // console.warn("Either `root` parameter or global `window` is not valid. Seems like this is a server-side environment. "
    //   + "To use DOMPurify on server-side, you need to provide a valid `root` parameter (this can be done by using virtual DOM providers like `jsdom`).");

    return null;
  }

  return DOMPurify(rootWindow);
}

export function renderAndSanitizeMarkdown(markdown: string, options: {
  domRoot?: WindowLike,
  dompurify?: typeof DOMPurify,
  markedRenderer?: Renderer,
}): string {
  const renderer = options.markedRenderer ?? createMarkedRenderer();
  const dompurify = options.dompurify ?? resolveDOMPurify(options.domRoot);

  if(!dompurify) return markdown;

  return dompurify.sanitize(
    marked.parse(markdown, {
      ...MARKED_OPTIONS,
      async: false,
      renderer: renderer,
    }), DOMPURIFY_OPTIONS);
}
