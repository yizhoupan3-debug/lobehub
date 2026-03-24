import { SKIP, visit } from 'unist-util-visit';

function createAgenticRehypePlugin(tagName: string) {
  return () => (tree: any) => {
    visit(tree, (node, index, parent) => {
      // remark will sometimes parse XML blocks as a single raw node
      if (node.type === 'raw' && node.value.startsWith(`<${tagName}`)) {
        const valueStr = node.value as string;
        const attributes: Record<string, string> = {};
        
        const openTagMatch = valueStr.match(new RegExp(`<${tagName}([^>]*)>`));
        if (openTagMatch) {
          const attrRegex = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
          let match;
          while ((match = attrRegex.exec(openTagMatch[1])) !== null) {
            attributes[match[1]] = match[2];
          }
        }
        
        const innerMatch = valueStr.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`));
        const innerText = innerMatch ? innerMatch[1].trim() : '';

        const newNode = {
          children: [{ type: 'text', value: innerText }],
          properties: attributes,
          tagName: tagName,
          type: 'element',
        };
        parent.children.splice(index as number, 1, newNode);
        return [SKIP, index];
      }
      
      // if it was parsed as HTML element wrapped in a paragraph
      if (node.type === 'element' && node.tagName === 'p' && node.children?.length > 0) {
        const firstChild = node.children[0];
        if (firstChild.type === 'raw' && firstChild.value.startsWith(`<${tagName}`)) {
          const valueStr = firstChild.value as string;
          const attributes: Record<string, string> = {};
          const openTagMatch = valueStr.match(new RegExp(`<${tagName}([^>]*)>`));
          if (openTagMatch) {
            const attrRegex = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
            let match;
            while ((match = attrRegex.exec(openTagMatch[1])) !== null) {
              attributes[match[1]] = match[2];
            }
          }

          let innerText = node.children
            .slice(1, -1)
            .map((child: any) => {
              if (child.type === 'raw') return child.value;
              if (child.type === 'text') return child.value;
              if (child.type === 'element') {
                // very basic inner text extraction for child elements
                if (child.children?.[0]?.value) return child.children[0].value;
              }
              return '';
            })
            .join('')
            .trim();
            
          // If the last child is the closing tag but it wasn't stripped properly, handle it
          const lastChild = node.children[node.children.length - 1];
          if (lastChild && lastChild.type === 'raw' && !lastChild.value.includes(`</${tagName}>`)) {
             innerText += lastChild.value;
          }

          const newNode = {
            children: [{ type: 'text', value: innerText }],
            properties: attributes,
            tagName: tagName,
            type: 'element',
          };

          parent.children.splice(index as number, 1, newNode);
          return [SKIP, index];
        }
      }
    });
  };
}

export default createAgenticRehypePlugin;
