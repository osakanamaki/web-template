// CSS文字列から共有可能なスタイルシートを作る（全インスタンスで1枚を使い回す）
const css = (text) => {
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(text);
  return sheet;
};

class BaseLink extends HTMLElement {
  // BaseLink自身が出力する要素（外部リンクアイコン・読み上げ用テキスト）のスタイル
  static baseStyles = css(`
    :host {
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .external-icon {
      width: 0.85em;
      height: 0.85em;
      margin-left: 0.3em;
      vertical-align: -0.05em;
      opacity: 0.6;
    }
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `);

  // サブクラスは static styles に自分のレイアウト用スタイルを定義する
  static styles = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const { styles } = this.constructor;
    this.shadowRoot.adoptedStyleSheets = styles
      ? [BaseLink.baseStyles, styles]
      : [BaseLink.baseStyles];
  }

  getCardProps() {
    const url = this.getAttribute('url') || '#';
    return {
      url,
      title: this.getAttribute('title') || 'No Title',
      description: this.getAttribute('description') || '',
      image: this.getAttribute('image') || '',
      external: this.isExternal(url)
    };
  }

  isExternal(url) {
    try {
      const target = new URL(url, location.href);
      return /^https?:$/.test(target.protocol) && target.origin !== location.origin;
    } catch {
      return false;
    }
  }

  static EXTERNAL_ICON = `<svg class="external-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6"/><path d="M20 4 10 14"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg><span class="visually-hidden">（外部サイト）</span>`;

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

class Horizontal extends BaseLink {
  static styles = css(`
    :host {
      margin: 0.5rem 0;
    }
    .card {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      text-decoration: none;
      color: #1a202c;
      background-color: #ffffff;
      transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
      height: 120px;
    }
    .card:hover {
      transform: translateY(-1px);
      border-color: #cbd5e1;
      box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.18);
    }
    .content {
      flex: 1;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0; /* テキスト省略(ellipsis)を効かせるために必須 */
    }
    .title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.25s;
    }
    .card:hover .title {
      color: #0f4c81;
    }
    .external-icon {
      transition: transform 0.25s;
    }
    .card:hover .external-icon {
      transform: translate(1px, -1px);
    }
    .description {
      font-size: 0.85rem;
      color: #64748b;
      margin: 4px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .media {
      width: 120px;
      flex-shrink: 0;
      overflow: hidden; /* 拡大した画像を枠内に収める */
      border-left: 1px solid #e2e8f0;
    }
    .thumbnail {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .card:hover .thumbnail {
      transform: scale(1.02);
    }
    @media (min-width: 600px) {
      .media {
        width: 180px;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .card, .thumbnail, .external-icon {
        transition: none;
      }
      .card:hover,
      .card:hover .thumbnail,
      .card:hover .external-icon {
        transform: none;
      }
    }
  `);

  connectedCallback() {
    const { url, title, description, image, external } = this.getCardProps();
    this.shadowRoot.innerHTML = `
      <a class="card" href="${this.escapeHTML(url)}"${external ? ' rel="noopener noreferrer"' : ''}>
        <div class="content">
          <div>
            <p class="title">${this.escapeHTML(title)}${external ? BaseLink.EXTERNAL_ICON : ''}</p>
            ${description ? `<p class="description">${this.escapeHTML(description)}</p>` : ''}
          </div>
        </div>
        ${image ? `<div class="media"><img class="thumbnail" src="${this.escapeHTML(image)}" alt="" loading="lazy"></div>` : ''}
      </a>
    `;
  }
}

class Overlay extends BaseLink {
  static styles = css(`
    :host {
      margin: 0.5rem 0;
    }
    .card {
      position: relative;
      display: block;
      aspect-ratio: 16 / 9;
      border-radius: 8px;
      overflow: hidden;
      text-decoration: none;
      color: #ffffff;
      background-color: #334155; /* 画像がないときの下地 */
      transition: box-shadow 0.2s;
    }
    .card:hover {
      box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.25);
    }
    .thumbnail {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }
    .card:hover .thumbnail {
      transform: scale(1.04);
    }
    .content {
      position: absolute;
      inset: auto 0 0 0;
      padding: 48px 16px 12px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
      min-width: 0;
    }
    .title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
      line-height: 1.4;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .description {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.85);
      margin: 4px 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `);

  connectedCallback() {
    const { url, title, description, image, external } = this.getCardProps();
    this.shadowRoot.innerHTML = `
      <a class="card" href="${this.escapeHTML(url)}"${external ? ' rel="noopener noreferrer"' : ''}>
        ${image ? `<img class="thumbnail" src="${this.escapeHTML(image)}" alt="" loading="lazy">` : ''}
        <div class="content">
          <div>
            <p class="title">${this.escapeHTML(title)}${external ? BaseLink.EXTERNAL_ICON : ''}</p>
            ${description ? `<p class="description">${this.escapeHTML(description)}</p>` : ''}
          </div>
        </div>
      </a>
    `;
  }
}

customElements.define('link-horizontal', Horizontal);
customElements.define('link-overlay', Overlay);
