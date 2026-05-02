// ===== ビューワー =====
const bookViewer  = document.getElementById('bookViewer');
const viewerClose = document.getElementById('viewerClose');
const book3d      = document.getElementById('book3d');
const pageLeft    = document.getElementById('pageLeft');
const pageRight   = document.getElementById('pageRight');
const prevBtn     = document.getElementById('prevPage');
const nextBtn     = document.getElementById('nextPage');
const pageNumEl   = document.getElementById('pageNum');

let currentBook  = null;
let currentSpread = 0; // 見開きインデックス

// ページテキストをHTMLに変換（改行→<br>）
function formatText(text) {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

function renderSpread() {
  const pages = currentBook.pages;
  const total  = pages.length;

  // 見開き（左ページ＝偶数インデックス, 右ページ＝奇数）
  const leftIdx  = currentSpread * 2;
  const rightIdx = currentSpread * 2 + 1;

  pageLeft.innerHTML  = leftIdx  < total ? `
    <div style="font-size:9px;color:rgba(42,31,14,0.35);margin-bottom:20px;letter-spacing:0.1em">${currentBook.title}</div>
    <div style="font-size:12px;line-height:2;letter-spacing:0.05em;color:#2a1f0e">${formatText(pages[leftIdx])}</div>
    <div style="position:absolute;bottom:16px;left:28px;font-size:9px;color:rgba(42,31,14,0.3)">${leftIdx + 1}</div>
  ` : '';

  pageRight.innerHTML = rightIdx < total ? `
    <div style="font-size:9px;color:rgba(42,31,14,0.35);margin-bottom:20px;text-align:right;letter-spacing:0.1em">${currentBook.author}</div>
    <div style="font-size:12px;line-height:2;letter-spacing:0.05em;color:#2a1f0e">${formatText(pages[rightIdx])}</div>
    <div style="position:absolute;bottom:16px;right:28px;font-size:9px;color:rgba(42,31,14,0.3)">${rightIdx + 1}</div>
  ` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:10px;color:rgba(42,31,14,0.25);letter-spacing:0.15em">— 了 —</div>`;

  const spreadCount = Math.ceil(currentBook.pages.length / 2);
  pageNumEl.textContent = `${currentSpread + 1} / ${spreadCount}`;
  prevBtn.disabled = currentSpread === 0;
  nextBtn.disabled = currentSpread >= spreadCount - 1;
}

function turnPage(direction) {
  // めくりアニメーション
  if (direction === 'next') {
    pageRight.classList.add('turning');
    setTimeout(() => {
      pageRight.classList.remove('turning');
      currentSpread++;
      renderSpread();
    }, 500);
  } else {
    pageLeft.classList.add('turning');
    setTimeout(() => {
      pageLeft.classList.remove('turning');
      currentSpread--;
      renderSpread();
    }, 500);
  }
}

// 外部から呼ばれる
function openViewer(book) {
  currentBook   = book;
  currentSpread = 0;

  // 背表紙の色を3Dに反映
  book3d.querySelector('.book-spine-3d').style.background =
    `linear-gradient(to right, ${darken(book.color)}, ${book.color}, ${darken(book.color)})`;

  renderSpread();

  // 開くアニメーション
  bookViewer.classList.add('open');
  pageLeft.style.transform  = 'rotateY(-90deg)';
  pageRight.style.transform = 'rotateY(90deg)';
  setTimeout(() => {
    pageLeft.style.transform  = '';
    pageRight.style.transform = '';
  }, 50);
}

function darken(hex) {
  // 簡易的に少し暗くする
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - 40);
  const g = Math.max(0, ((n >> 8)  & 0xff) - 40);
  const b = Math.max(0, ((n)       & 0xff) - 40);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// 閉じる
viewerClose.addEventListener('click', () => {
  bookViewer.classList.remove('open');
});
bookViewer.addEventListener('click', e => {
  if (e.target === bookViewer) bookViewer.classList.remove('open');
});

// ページ送り
nextBtn.addEventListener('click', () => {
  if (!nextBtn.disabled) turnPage('next');
});
prevBtn.addEventListener('click', () => {
  if (!prevBtn.disabled) turnPage('prev');
});

// キーボード操作
document.addEventListener('keydown', e => {
  if (!bookViewer.classList.contains('open')) return;
  if (e.key === 'ArrowRight' && !nextBtn.disabled) turnPage('next');
  if (e.key === 'ArrowLeft'  && !prevBtn.disabled) turnPage('prev');
  if (e.key === 'Escape') bookViewer.classList.remove('open');
});