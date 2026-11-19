class ParagraphCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.wrapMarkdown();

    const image = this.getAttribute('image') || '';
    const alt = this.getAttribute('alt') || '';
    const caption = this.getAttribute('caption') || '';
    const position = this.getAttribute('position') === 'right' ? 'right' : 'left';
    const width = this.getAttribute('width') || '40%';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flow-root; /* floatの回り込みをこのコンポーネント内で自動解除（clearfix） */
          margin: 2rem 0;
          line-height: 1.8;
        }
        figure {
          margin: 0 0 1rem 0;
          width: ${width};
          max-width: 100%;
          float: ${position};
          ${position === 'left' ? 'margin-right: 1.5rem;' : 'margin-left: 1.5rem;'}
        }
        img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          display: block;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        figcaption {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.5rem;
          text-align: center;
          line-height: 1.4;
        }
        /* スロット内の先頭・末尾の余白調整 */
        ::slotted(*:first-child) {
          margin-top: 0;
        }
        ::slotted(*:last-child) {
          margin-bottom: 0;
        }

        /* スマホ画面（600px未満）ではフロートを解除して縦積みにする */
        @media (max-width: 600px) {
          figure {
            float: none;
            width: 100%;
            margin: 0 0 1.25rem 0;
          }
        }
      </style>

      ${image ? `
        <figure>
          <img src="${this.escapeHTML(image)}" alt="${this.escapeHTML(alt)}" loading="lazy">
          ${caption ? `<figcaption>${this.escapeHTML(caption)}</figcaption>` : ''}
        </figure>
      ` : ''}
      
      <div class="text-body">
        <slot></slot>
      </div>
    `;
  }

  // 子要素を持たずテキストだけが書かれている場合は Markdown とみなし、
  // 自動的に <markdown-parser> で包む
  wrapMarkdown() {
    if (this.children.length > 0 || !this.textContent.trim()) return;

    const md = document.createElement('markdown-parser');
    md.textContent = this.textContent;
    this.replaceChildren(md);
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag]));
  }
}

customElements.define('p-card', ParagraphCard);