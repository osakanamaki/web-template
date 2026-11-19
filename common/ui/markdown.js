class Parser extends HTMLElement {
  connectedCallback() {
    if (this.dataset.parsed) return;
    this.style.display = 'block';

    const rawText = this.textContent;
    const cleanText = this.stripIndent(rawText);

    // グローバルの marked を使用
    this.innerHTML = marked.parse(cleanText);
    this.dataset.parsed = 'true';
  }

  stripIndent(str) {
    const lines = str.replace(/^\n+|\n+$/g, '').split('\n');
    const minIndent = lines
      .filter(line => line.trim().length > 0)
      .reduce((min, line) => {
        const indent = line.match(/^\s*/)[0].length;
        return Math.min(min, indent);
      }, Infinity);

    return minIndent === Infinity
      ? str
      : lines.map(line => line.slice(minIndent)).join('\n');
  }
}

customElements.define('markdown-parser', Parser);