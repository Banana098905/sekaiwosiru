// ===== アトリエ初期化（完全版）=====
(function initAtelier() {
  const atelierCanvas = document.getElementById('atelierCanvas');
  if (!atelierCanvas) return;

  const ctx = atelierCanvas.getContext('2d');
  const textInputArea = document.getElementById('textInputArea');
  const textInput = document.getElementById('textInput');

  const DPR = window.devicePixelRatio || 1;
  const W = 280;
  const H = 390;
  atelierCanvas.width = W * DPR;
  atelierCanvas.height = H * DPR;
  atelierCanvas.style.width = W + 'px';
  atelierCanvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  const state = {
    tool: 'pen',
    color: '#2a1f0e',
    size: 4,
    opacity: 1,
    font: "'Noto Serif JP', serif",
    drawing: false,
    lastX: 0,
    lastY: 0,
  };

  // カラーパレット
  const COLORS = [
    '#2a1f0e', '#d4a855', '#8B4513', '#1a3a5c',
    '#2d5a2d', '#4a2d6b', '#6b2d2d', '#1a4a4a',
    '#faf8f0', '#c0392b', '#2980b9', '#27ae60',
    '#8e44ad', '#e67e22', '#95a5a6', '#2c3e50',
  ];
  const palette = document.getElementById('colorPalette');
  if (palette) {
    COLORS.forEach(c => {
      const dot = document.createElement('div');
      dot.className = 'color-dot' + (c === state.color ? ' active' : '');
      dot.style.background = c;
      dot.addEventListener('click', () => {
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        state.color = c;
      });
      palette.appendChild(dot);
    });
  }

  // ツール切替
  document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.tool = btn.dataset.tool;
      const cursors = { pen: 'crosshair', eraser: 'cell', text: 'text', image: 'default', shape: 'crosshair', move: 'grab' };
      atelierCanvas.style.cursor = cursors[state.tool] || 'default';
      if (state.tool === 'image') pickImage();
    });
  });

  // サイズ
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.size = parseInt(btn.dataset.size);
    });
  });

  // 透明度
  const opacitySlider = document.getElementById('opacitySlider');
  if (opacitySlider) {
    opacitySlider.addEventListener('input', e => {
      state.opacity = parseInt(e.target.value) / 100;
    });
  }

  // フォント
  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) {
    fontSelect.addEventListener('change', e => {
      state.font = e.target.value;
    });
  }

  // テンプレート
  const TEMPLATES = [
    { bg: '#1a3a5c', fg: '#d4a855', label: '夜' },
    { bg: '#faf8f0', fg: '#2a1f0e', label: '紙' },
    { bg: '#2d1a0e', fg: '#c0a060', label: '木' },
  ];
  const templateRow = document.getElementById('templateRow');
  if (templateRow) {
    TEMPLATES.forEach(t => {
      const thumb = document.createElement('div');
      thumb.className = 'template-thumb';
      thumb.style.background = t.bg;
      thumb.innerHTML = `
        <div style="flex:1;background:${t.fg};opacity:0.25"></div>
        <div style="height:40%;background:${t.bg};border-top:2px solid ${t.fg}"></div>
      `;
      thumb.addEventListener('click', () => {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = t.bg;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = t.fg;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, W, 3);
        ctx.fillRect(0, H - 3, W, 3);
        ctx.globalAlpha = 1;
      });
      templateRow.appendChild(thumb);
    });
  }

  function getPos(e) {
    const rect = atelierCanvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const src = e.touches ? e.touches[0] : e;
    let x = (src.clientX - rect.left) * scaleX;
    let y = (src.clientY - rect.top) * scaleY;
    x = Math.min(Math.max(0, x), W);
    y = Math.min(Math.max(0, y), H);
    return { x, y };
  }

  atelierCanvas.addEventListener('mousedown', onStart);
  atelierCanvas.addEventListener('mousemove', onMove);
  atelierCanvas.addEventListener('mouseup', onEnd);
  atelierCanvas.addEventListener('mouseleave', onEnd);
  atelierCanvas.addEventListener('touchstart', e => { e.preventDefault(); onStart(e); }, { passive: false });
  atelierCanvas.addEventListener('touchmove', e => { e.preventDefault(); onMove(e); }, { passive: false });
  atelierCanvas.addEventListener('touchend', onEnd);

  function onStart(e) {
    const pos = getPos(e);
    if (state.tool === 'text') { placeText(e, pos); return; }
    if (state.tool === 'shape') { drawShape(pos); return; }
    if (state.tool !== 'pen' && state.tool !== 'eraser') return;
    state.drawing = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.globalAlpha = state.opacity;
    ctx.lineWidth = state.size;
    ctx.lineCap = 'round';
    if (state.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = state.size * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = state.color;
    }
    ctx.lineTo(pos.x + 0.5, pos.y + 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function onMove(e) {
    if (!state.drawing) return;
    const pos = getPos(e);
    ctx.globalAlpha = state.opacity;
    ctx.lineWidth = state.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (state.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = state.size * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = state.color;
    }
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function onEnd() {
    if (!state.drawing) return;
    state.drawing = false;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // ★★★ 修正済みテキスト配置 ★★★
  function placeText(e, pos) {
    if (!textInputArea || !textInput) {
      console.error('テキスト入力要素が見つかりません');
      // フォールバック：promptを使用
      const fallbackText = prompt('テキストを入力してください');
      if (fallbackText) {
        ctx.save();
        ctx.globalAlpha = state.opacity;
        ctx.fillStyle = state.color;
        ctx.font = `${state.size * 2.5 + 8}px ${state.font}`;
        ctx.fillText(fallbackText, pos.x, pos.y);
        ctx.restore();
      }
      return;
    }

    const rect = atelierCanvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    let dispX = src.clientX - rect.left;
    let dispY = src.clientY - rect.top;

    dispX = Math.min(Math.max(0, dispX), rect.width - 120);
    dispY = Math.min(Math.max(0, dispY), rect.height - 50);

    textInputArea.style.position = 'absolute';
    textInputArea.style.left = dispX + 'px';
    textInputArea.style.top = dispY + 'px';
    textInputArea.style.display = 'block';
    textInputArea.classList.add('visible');
    
    textInput.value = '';
    textInput.style.color = state.color;
    textInput.style.fontFamily = state.font;
    textInput.style.fontSize = (state.size * 2.5 + 8) + 'px';
    textInput.style.background = 'rgba(255,255,240,0.95)';
    textInput.style.border = '1px solid #d4a855';
    textInput.style.borderRadius = '3px';
    textInput.style.padding = '6px 10px';
    textInput.style.outline = 'none';
    textInput.style.minWidth = '120px';
    
    textInput.focus();

    function commit() {
      const val = textInput.value.trim();
      if (val) {
        ctx.save();
        ctx.globalAlpha = state.opacity;
        ctx.fillStyle = state.color;
        ctx.font = `${state.size * 2.5 + 8}px ${state.font}`;
        ctx.fillText(val, pos.x, pos.y);
        ctx.restore();
      }
      textInputArea.classList.remove('visible');
      textInputArea.style.display = 'none';
      textInput.removeEventListener('blur', commit);
      textInput.removeEventListener('keydown', onKey);
    }

    function onKey(ke) {
      if (ke.key === 'Enter') {
        ke.preventDefault();
        commit();
      }
      if (ke.key === 'Escape') {
        textInputArea.classList.remove('visible');
        textInputArea.style.display = 'none';
      }
    }

    textInput.addEventListener('keydown', onKey);
    textInput.addEventListener('blur', commit, { once: true });
  }

  function drawShape(pos) {
    ctx.save();
    ctx.globalAlpha = state.opacity;
    ctx.fillStyle = state.color;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, state.size * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function pickImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = re => {
        const img = new Image();
        img.onload = () => {
          let w = img.width, h = img.height;
          const maxW = W * 0.7, maxH = H * 0.7;
          if (w > maxW) { h = h * maxW / w; w = maxW; }
          if (h > maxH) { w = w * maxH / h; h = maxH; }
          ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
        };
        img.src = re.target.result;
      };
      reader.readAsDataURL(file);
    };
    input.click();
    setTimeout(() => {
      const penBtn = document.querySelector('[data-tool="pen"]');
      if (penBtn) {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        penBtn.classList.add('active');
        state.tool = 'pen';
        atelierCanvas.style.cursor = 'crosshair';
      }
    }, 300);
  }

  // クリア
  document.getElementById('clearBtn')?.addEventListener('click', () => {
    if (confirm('キャンバスをクリアしますか？')) {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#faf8f0';
      ctx.fillRect(0, 0, W, H);
    }
  });

  // 保存
  document.getElementById('saveBtn')?.addEventListener('click', () => {
    const title = prompt('本のタイトルを入力してください', '無題の本') || '無題の本';
    const cover = atelierCanvas.toDataURL('image/png');
    const saved = JSON.parse(localStorage.getItem('myBooks') || '[]');
    saved.push({ title, cover, createdAt: Date.now() });
    localStorage.setItem('myBooks', JSON.stringify(saved));
    alert(`「${title}」を本棚に保存しました！`);
  });

  // 書き出し
  document.getElementById('exportBtn')?.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'cover.png';
    link.href = atelierCanvas.toDataURL('image/png');
    link.click();
  });

  // 初期化
  ctx.fillStyle = '#faf8f0';
  ctx.fillRect(0, 0, W, H);
})();