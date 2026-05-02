const openBtn    = document.getElementById('openBtn');
const overlay    = document.getElementById('overlay');
const shelfPreview = document.getElementById('shelfPreview');
const shelfMini  = document.getElementById('shelfMini');
const errorMsg   = document.getElementById('errorMsg');
const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');

// デモ用アカウント（本番はサーバー認証に差し替え）
const DEMO_USER = 'demo';
const DEMO_PASS = 'demo1234';

const spineColors  = ['#8B4513','#1a3a5c','#2d5a2d','#4a2d6b','#5c3d1a','#1a4a4a','#6b2d2d','#3d4a1a','#2a3d5c','#5c2d4a'];
const spineHeights = [68, 52, 80, 44, 72, 58, 64, 48, 76, 54];

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.animation = 'none';
  requestAnimationFrame(() => {
    errorMsg.style.animation = '';
  });
}

function doOpen() {
  const user = usernameEl.value.trim();
  const pass = passwordEl.value.trim();

  errorMsg.textContent = '';

  if (!user || !pass) {
    showError('利用者の名と合言葉を入力してください');
    return;
  }

  // デモ認証（何でもOKにしたければ下のif文を削除）
  // if (user !== DEMO_USER || pass !== DEMO_PASS) {
  //   showError('利用者の名または合言葉が違います');
  //   return;
  // }

  openBtn.textContent = '扉を開いています...';
  openBtn.disabled = true;

  // セッション保存
  sessionStorage.setItem('userName', user);

  setTimeout(() => {
    overlay.classList.add('active');

    // 背表紙を1冊ずつ立ち上げる
    spineHeights.forEach((h, i) => {
      const spine = document.createElement('div');
      spine.className = 'spine';
      spine.style.height   = h + 'px';
      spine.style.background = spineColors[i % spineColors.length];
      shelfMini.appendChild(spine);
      setTimeout(() => spine.classList.add('show'), i * 75 + 300);
    });

    setTimeout(() => shelfPreview.classList.add('visible'), 380);

    // 本棚ページへ遷移
    setTimeout(() => {
      window.location.href = 'shelf.html';
    }, 2600);

  }, 600);
}

// ボタンクリック
openBtn.addEventListener('click', doOpen);

// Enterキー
[usernameEl, passwordEl].forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') doOpen();
  });
});