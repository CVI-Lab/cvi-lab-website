/**
 * Convert standalone LaTeX-style bracket equations into the same math nodes
 * produced by remark-math. Inline square brackets remain ordinary Markdown.
 */
export default function remarkBracketMath() {
  return (tree, file) => {
    const source = String(file.value ?? '');

    const visitChildren = (parent) => {
      if (!Array.isArray(parent.children)) return;

      parent.children.forEach((node, index) => {
        if (node.type === 'paragraph'
          && Number.isInteger(node.position?.start?.offset)
          && Number.isInteger(node.position?.end?.offset)) {
          const raw = source.slice(node.position.start.offset, node.position.end.offset);
          const escapedBrackets = raw.match(/^\\\[\s*([\s\S]*?)\s*\\\]$/);
          const lineBrackets = raw.match(/^\[\s*\r?\n([\s\S]*?)\r?\n\s*\]$/);
          const value = (escapedBrackets?.[1] ?? lineBrackets?.[1])?.trim();

          if (value) {
            parent.children[index] = {
              type: 'math',
              meta: null,
              value,
              data: {
                hName: 'pre',
                hChildren: [{
                  type: 'element',
                  tagName: 'code',
                  properties: { className: ['language-math', 'math-display'] },
                  children: [{ type: 'text', value }],
                }],
              },
              position: node.position,
            };
            return;
          }
        }

        visitChildren(node);
      });
    };

    visitChildren(tree);
  };
}
