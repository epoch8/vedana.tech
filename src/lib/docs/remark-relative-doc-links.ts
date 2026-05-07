import { visit } from "unist-util-visit";

export default function remarkRelativeDocLinks() {
  return (tree: any) => {
    visit(tree, "link", (node: any) => {
      if (!node.url) return;

      // only local markdown links
      if (
        /\.md(?=#|$)/.test(node.url) &&
        !node.url.startsWith("http")
      ) {
        node.url = node.url
          .replace(/\.md(?=#|$)/, "")
          .replace(/^\.\//, "/docs/");
      }
    });
  };
}