const canvas = document.getElementById('plazaCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const tooltip = document.getElementById('bookTooltip');

  const plazaBooks = [
    { title: '銀河の果て',   author: '星野 一',  color: '#4a8fd4' },
    { title: '雨の図書館',   author: '木村 葵',  color: '#4ad48a' },
    { title: '静かな声',     author: '白石 詩',  color: '#a04ad4' },
    { title: '海の地図',     author: '波多 海',  color: '#4ad4c8' },
    { title: '午前3時',      author: '夜見 零',  color: '#d44a4a' },
    { title: '光の粒子',     author: '光 一郎',  color: '#d4c84a' },
    { title: '真夜中の庭',   author: '夜 澄香',  color: '#8ad44a' },
    { title: '終わりの始まり', author: '終 始也', color: '#d48a4a' },
  ];

  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // パーティクル初期化
  plazaBooks.forEach((book, i) => {
    const angle = (i / plazaBooks.length) * Math.PI * 2;
    const r = Math.min(W, H) * 0.28;
    particles.push({
      ...book,
      x: W / 2 + Math.cos(angle) * r,
      y: H / 2 + Math.sin(angle) * r,
      baseX: W / 2 + Math.cos(angle) * r,
      baseY: H / 2 + Math.sin(angle) * r,
      radius: 18 + Math.random() * 10,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.006,
    });
  });

  // マウスホバー
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let hit = null;

    particles.forEach(p => {
      const dx = mx - p.x;
      const dy = my - p.y;
      if (Math.sqrt(dx*dx + dy*dy) < p.radius) hit = p;
    });

    if (hit) {
      tooltip.style.opacity = '1';
      tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
      tooltip.style.top  = (e.clientY - rect.top  - 16) + 'px';
      tooltip.innerHTML = `<strong style="color:#d4a855">${hit.title}</strong><br>${hit.author}`;
    } else {
      tooltip.style.opacity = '0';
    }
  });

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    // 中央の光
    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, 100);
    grad.addColorStop(0, 'rgba(180,140,70,0.08)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.x = p.baseX + Math.cos(time * p.speed + p.phase) * 8;
      p.y = p.baseY + Math.sin(time * p.speed + p.phase) * 6;

      // グロー
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
      glow.addColorStop(0, p.color + '55');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 本体
      ctx.fillStyle = p.color + 'cc';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // タイトル
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '9px serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.title.slice(0, 5), p.x, p.y + 3);
    });

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}