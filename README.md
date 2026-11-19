# 自作Webサイト テンプレート

HTML・CSS・JavaScript だけで作る、個人サイトの雛形です。

[https://osakanamaki.github.io/web-template/](https://osakanamaki.github.io/web-template/)

---

## フォルダ構成

```
web-template/
├── index.html          … トップページ
├── 404.html            … 存在しないURLを開いたときのページ
├── favicon.svg         … タブのアイコン
├── pages/
│   └── sample/
│       └── index.html  … 下層ページの雛形（コピーして使う）
└── common/
    ├── img/            … 画像
    ├── css/            … 見た目（レイアウト・背景など）
    └── ui/             … 部品（WebComponents）
```

## WebComponets

部品を使うページでは `<head>` で対応する `common/ui/*.js` を読み込んでください。

<details>

<summary>link-horizontal: 横長のリンクカード</summary>

```html
<link-horizontal
    url="pages/sample/index.html"
    title="タイトル"
    description="説明文"
    image="common/img/thumb-1.svg">
</link-horizontal>
```

</details>

<details>

<summary>link-overlay: 画像の上に文字が乗るカード</summary>

```html
<link-overlay class="w-33" url="https://example.com" title="タイトル" description="説明" image="common/img/thumb-1.svg">
</link-overlay>
```

外部サイト（`https://...`）へのリンクには自動で ↗ アイコンが付きます。

</details>

<details>

<summary>p-card: 画像＋文章</summary>

```html
<p-card image="common/img/icon.svg" position="right" width="250px" alt="アイコン" caption="キャプション">
    # 見出し
    本文は **Markdown** で書けます。
</p-card>
```

| 属性 | 説明 | 省略時 |
| --- | --- | --- |
| `position` | `left` / `right`：画像の位置 | `left` |
| `width` | 画像の幅 | `40%` |
| `caption` | 画像の下の説明文 | なし |

</details>


<details>

<summary>markdown-parser: Markdownで文章を書く</summary>

```html
<markdown-parser>
    # 見出し
    - 箇条書き
</markdown-parser>
```

`marked`（CDN）を `markdown.js` より先に読み込む必要があります。

> ⚠️ Markdown の中で `<` `>` をそのまま書くと、ブラウザがHTMLタグとして解釈して表示が崩れます。
> `<title>` のように書きたいときは `&lt;title&gt;` と書いてください。（`<p-card>` の中も同じです）


</details>


<details>

<summary>footer-copyright: フッター</summary>

```html
<footer-copyright author="名前" repo="https://github.com/ユーザー名"></footer-copyright>
```

`year` を省略すると今年の年が入ります。

</details>

### CSS の役割

| ファイル | 役割 |
| --- | --- |
| `layout-one-line-content.css` | 本文を中央1カラムに収める |
| `bg-off-white.css` | うっすらグラデーションの背景 |
| `grid-width-split.css` | `w-*` クラスで横並び |
| `scroll-snap.css` | 全画面バナー → 本文へのスナップスクロール |

色を変えたいときは各CSSや `common/ui/*.js` 内の `<style>` の色コード（`#xxxxxx`）を書き換えてください。

<details>

<summary>grid-width-split: 横に並べる</summary>

```html
<main>
    <div class="w-50">左半分</div>
    <div class="w-50">右半分</div>
</main>
```

`<main>` 直下の要素に `class="w-50"`（2列）や `class="w-33"`（3列）を付けると横に並びます。
スマホ幅では自動で縦1列になります。

| class | 幅 |
| --- | --- |
| `w-100` | 全幅 |
| `w-75` / `w-66` / `w-50` / `w-33` / `w-25` | 3/4 ・ 2/3 ・ 1/2 ・ 1/3 ・ 1/4 |

</details>

## テンプレートを利用する

`Use this template` から本リポジトリを利用できます

## GitHub Pages で公開する

1. リポジトリの **Settings → Pages** で、Source を `Deploy from a branch`、Branch を `main` / `/ (root)` にする
2. 数分後に `https://ユーザー名.github.io/リポジトリ名/` で公開されます（リポジトリ名を `ユーザー名.github.io` にすると `https://ユーザー名.github.io/` になります）

`404.html` はどの階層のURLでも表示されるため、サイトの起点（`/` か `/リポジトリ名/` か）をJSで自動判定して画像・リンクのパスを組み立てています。
どちらの公開方法でも、独自ドメインでも、書き換えは不要です。
