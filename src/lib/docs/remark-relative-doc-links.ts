import { visit } from "unist-util-visit";
import path from "node:path";

/**
 * Rewrites local Markdown links to absolute `/docs/...` URLs so the browser
 * doesn't have to perform relative URL resolution against trailing-slash
 * page URLs (which silently puts the source section back into the path,
 * producing 404s like `/docs/getting-started/architecture/X`).
 *
 * Three link styles are supported:
 *
 *  - **Docs-root convention** (`./section/file.md`): the leading `./` here
 *    historically means "from the docs root" — i.e. `./architecture/X.md`
 *    rewrites to `/docs/architecture/X`. This convention is used in the
 *    majority of existing docs and is kept as-is to avoid a sweeping content
 *    rewrite.
 *
 *  - **File-relative `./` (sibling)** (`./file.md`, no inner slash): treated
 *    as a sibling in the same directory as the current file. From
 *    `getting-started/quick-start.md`, `./configuration.md` →
 *    `/docs/getting-started/configuration`.
 *
 *  - **File-relative `../`** (`../section/file.md`): resolved against the
 *    directory of the current Markdown file inside `src/content/docs/`.
 *    From `getting-started/configuration.md`, `../architecture/X.md` →
 *    `/docs/architecture/X` (not `/docs/getting-started/architecture/X`).
 *
 * Links that are already absolute (`/docs/...`, `http(s)://`, `//`,
 * `mailto:`) or hash-only are left alone. Anything that doesn't end in `.md`
 * (or `.md#...`) is also left alone.
 */
export default function remarkRelativeDocLinks() {
  return (tree: any, file: any) => {
    // Path of the current Markdown file. `file.path` is set by Astro's
    // content loader; `file.history` is the unified fallback.
    const filePath: string =
      (typeof file?.path === "string" && file.path) ||
      (Array.isArray(file?.history) && file.history[0]) ||
      "";

    const docsMarker = "src/content/docs/";
    const markerIdx = filePath.indexOf(docsMarker);
    // Directory of the current file relative to the docs root. Empty / "."
    // means the file lives directly at the docs root.
    const rawDir =
      markerIdx >= 0
        ? path.posix.dirname(
            filePath.slice(markerIdx + docsMarker.length).replace(/\\/g, "/"),
          )
        : "";
    const currentDir = rawDir === "." ? "" : rawDir;

    visit(tree, "link", (node: any) => {
      if (!node.url) return;

      if (
        node.url.startsWith("http://") ||
        node.url.startsWith("https://") ||
        node.url.startsWith("//") ||
        node.url.startsWith("mailto:") ||
        node.url.startsWith("#") ||
        node.url.startsWith("/")
      ) {
        return;
      }
      if (!/\.md(?=#|$)/.test(node.url)) return;

      // Split off optional hash fragment.
      const hashIdx = node.url.indexOf("#");
      const hash = hashIdx >= 0 ? node.url.slice(hashIdx) : "";
      const pathPart = hashIdx >= 0 ? node.url.slice(0, hashIdx) : node.url;
      const noMd = pathPart.replace(/\.md$/, "");

      // 1) `../` links → resolve against current file's directory.
      if (/(^|\/)\.\.\//.test(noMd) || noMd === "..") {
        const joined = currentDir ? path.posix.join(currentDir, noMd) : noMd;
        const normalized = path.posix.normalize(joined).replace(/^\.\/?/, "");
        node.url = "/docs/" + normalized + hash;
        return;
      }

      // 2) `./single-segment.md` (no further slash) → sibling-relative.
      //    Plain `single-segment.md` (no `./`, no slash) gets the same
      //    treatment for consistency.
      if (!noMd.includes("/") || (noMd.startsWith("./") && !noMd.slice(2).includes("/"))) {
        const sibling = noMd.replace(/^\.\//, "");
        const resolved = currentDir ? `${currentDir}/${sibling}` : sibling;
        node.url = "/docs/" + resolved + hash;
        return;
      }

      // 3) `./section/file.md` or `section/file.md` → docs-root convention.
      node.url = "/docs/" + noMd.replace(/^\.\//, "") + hash;
    });
  };
}
