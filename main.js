// ===== モード切替 =====
function switchMode(mode) {
  document.querySelectorAll('.mode-view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el  => el.classList.remove('active'));

  const view = document.getElementById('mode' + capitalize(mode));
  const btn  = document.querySelector(`[data-mode="${mode}"]`);
  if (view) view.classList.add('active');
  if (btn)  btn.classList.add('active');

  // 広場に切り替えたらcanvasをリサイズ
  if (mode === 'plaza') window.dispatchEvent(new Event('plazaActivated'));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ナビボタンにイベント
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => switchMode(btn.dataset.mode));
});

// ===== 時間帯で窓の色を変える =====
function setWindowByTime() {
  const win  = document.getElementById('roomWindow');
  if (!win) return;
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 9) {
    // 夜明け
    win.style.background = 'linear-gradient(to bottom, #ffb347 0%, #ffcc99 60%, #87ceeb 100%)';
    win.style.boxShadow  = '0 0 30px rgba(255,180,80,0.18), inset 0 0 16px rgba(0,0,0,0.2)';
  } else if (hour >= 9 && hour < 17) {
    // 昼
    win.style.background = 'linear-gradient(to bottom, #5bb8f5 0%, #87ceeb 100%)';
    win.style.boxShadow  = '0 0 24px rgba(135,206,235,0.1), inset 0 0 16px rgba(0,0,0,0.2)';
  } else if (hour >= 17 && hour < 20) {
    // 夕方
    win.style.background = 'linear-gradient(to bottom, #ff6b35 0%, #ff9a5c 40%, #ffcc70 100%)';
    win.style.boxShadow  = '0 0 30px rgba(255,100,50,0.15), inset 0 0 16px rgba(0,0,0,0.2)';
  } else {
    // 夜
    win.style.background = 'linear-gradient(to bottom, #0a0a2e 0%, #1a1a4e 100%)';
    win.style.boxShadow  = '0 0 20px rgba(30,30,80,0.12), inset 0 0 16px rgba(0,0,0,0.4)';
  }
}

setWindowByTime();