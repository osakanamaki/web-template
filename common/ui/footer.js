class Copyright extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const author = this.getAttribute('author') || '';
    const year = this.getAttribute('year') || String(new Date().getFullYear());
    const repo = this.getAttribute('repo') || '';

    const repoHtml = repo
      ? ` / ソースコード：<a href="${repo}" target="_blank" rel="noopener noreferrer">MIT License</a>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin-top: 4rem;
          padding: 2rem 1rem;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.6;
          text-align: center;
        }
        p {
          margin: 0.25rem 0;
        }
        a {
          color: inherit;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        a:hover {
          color: #111827;
        }
      </style>

      <footer>
        <p>&copy; ${year} ${author}</p>
        <p>
          記事コンテンツ：<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ja" target="_blank" rel="license noopener noreferrer">CC BY-NC-SA 4.0</a>${repoHtml}
        </p>
      </footer>
    `;
  }
}

customElements.define('footer-copyright', Copyright);