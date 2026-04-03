// Typing animation for the CodeWindow
export function setupTyping() {
  const codeBlock = document.querySelector('.code-window-body code');
  if (!codeBlock) return;
  
  if (codeBlock.hasAttribute('data-typed')) return;
  codeBlock.setAttribute('data-typed', 'true');
  
  let cursor = document.getElementById('typing-cursor');
  if (!cursor) {
    cursor = document.createElement('span');
    cursor.id = 'typing-cursor';
    cursor.className = 'animate-pulse font-bold text-gray-400 ml-px';
    cursor.textContent = '|';
  }

  const preElement = codeBlock.closest('pre');
  if (preElement) {
    (preElement as HTMLElement).style.minHeight = preElement.offsetHeight + 'px';
  }
  
  const textNodes: { node: Node; text: string }[] = [];
  const walker = document.createTreeWalker(codeBlock, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push({ node, text: node.nodeValue || '' });
  }
  
  textNodes.forEach(t => t.node.nodeValue = '');
  
  let nodeIndex = 0;
  let charIndex = 0;
  
  const typeNextChar = () => {
    if (nodeIndex >= textNodes.length) return;
    
    const current = textNodes[nodeIndex];
    if (current.text.length === 0) {
      nodeIndex++;
      typeNextChar();
      return;
    }
    
    if (charIndex < current.text.length) {
      current.node.nodeValue += current.text.charAt(charIndex);
      charIndex++;
      
      if (current.node.parentNode) {
        current.node.parentNode.insertBefore(cursor!, current.node.nextSibling);
      }
      
      setTimeout(typeNextChar, 10 + Math.random() * 15);
    } else {
      nodeIndex++;
      charIndex = 0;
      typeNextChar();
    }
  };
  
  setTimeout(typeNextChar, 200);
}
