// ===== 本データ =====
const booksData = {
  row1: [
    { title: '銀河の果て',     author: '星野 一',  color: '#1a3a5c', height: 90,  bookmarked: true,  pages: ['宇宙の果てで見つけた、\n小さな光の記録。\n\n遠い星雲の向こうに\n誰かが灯した火がある。', '第一章　出発\n\n宇宙船「暁丸」は静かに\n軌道を離れた。窓の外、\n青い地球が遠ざかっていく。', '終章\n\n星の海の果てに\n辿り着いた男が見たのは、\nただ、深い静寂だった。'] },
    { title: '雨の図書館',     author: '木村 葵',  color: '#2d5a2d', height: 75,  bookmarked: false, pages: ['古い図書館に眠る、\n忘れられた物語たち。\n\n雨が降るたびに\n扉が開く。', '雨の夜だけ現れる\n司書の老人は、\nいつも同じ本を読んでいた。'] },
    { title: '静かな声',       author: '白石 詩',  color: '#4a2d6b', height: 100, bookmarked: true,  pages: ['言葉にならない感情を、\n詩で紡いだ一冊。\n\n沈黙は\n最も深い詩である。', '君の名を\n呼ぶことができなくなった日\n春が終わった\n\n——白石 詩'] },
    { title: 'テクスチャの夢', author: '田中 透',  color: '#5c3d1a', height: 65,  bookmarked: false, pages: ['デザインと哲学の狭間に\n生きた男の話。\n\n美しいものだけが\n真実だと彼は信じた。'] },
    { title: '海の地図',       author: '波多 海',  color: '#1a4a4a', height: 85,  bookmarked: false, pages: ['古い海図に記された、\n幻の島を探す航海。\n\n波は地図を知らない。\nそれでも船は進む。', '第三の島\n\n霧の中に浮かぶ陸地。\nそこに何があるか、\n誰も知らなかった。'] },
    { title: '午前3時の哲学', author: '夜見 零',  color: '#6b2d2d', height: 110, bookmarked: true,  pages: ['眠れない夜に問い続けた、\n存在の意味。\n\n午前3時、\n世界は正直になる。', '「なぜ私は存在するのか」\n\nこの問いに答えた者は\nまだ誰もいない。\nそして、それでいい。'] },
    { title: '光の粒子',       author: '光 一郎',  color: '#3d4a1a', height: 78,  bookmarked: false, pages: ['量子力学と詩が交差する、\n不思議な世界。\n\n観測された瞬間に\n現実は生まれる。'] },
    { title: '忘れた言葉',     author: '記憶 朔',  color: '#2a3d5c', height: 92,  bookmarked: false, pages: ['言語を失った少女が\n見つけた、新しい声。\n\n声がなくても\n伝わるものがある。', '少女は絵を描いた。\n言葉の代わりに、\n色で語りかけた。'] },
  ],
  row2: [
    { title: '真夜中の庭',     author: '夜 澄香',  color: '#2d3a1a', height: 88,  bookmarked: false, pages: ['月明かりだけで育てた、\n秘密の花たち。\n\n夜に咲く花は\n太陽を知らない。'] },
    { title: '鉄の詩',         author: '鋼 詩人',  color: '#3a1a2d', height: 72,  bookmarked: true,  pages: ['工場の音楽から生まれた\nハードボイルド詩集。\n\n機械の鼓動も\n詩になる。', '鉄を打つ音が\nリズムを刻む\n汗が落ちる\nそれが詩だ\n\n——鋼 詩人'] },
    { title: 'かすかな記憶',   author: '霧島 遥',  color: '#1a2d3a', height: 95,  bookmarked: false, pages: ['老いた画家が描く、\n幼き日の断片。\n\n記憶は薄れても\n絵筆は覚えている。'] },
    { title: '名前のない色',   author: '彩 琉璃',  color: '#4a3a1a', height: 68,  bookmarked: false, pages: ['色覚過敏の少年が見る、\n誰も知らない色。\n\n世界は\n彼にだけ見える色で満ちていた。'] },
    { title: '終わりの始まり', author: '終 始也',  color: '#1a3a2d', height: 105, bookmarked: true,  pages: ['世界の最後の日に書かれた、\n最初の希望。\n\n終わりは\n必ず始まりを連れてくる。', '最後の日の日記\n\n空は不思議なほど\n青かった。\n終わりの色とは\n思えなかった。'] },
  ],
  row3: [
    { title: '砂漠の数学',     author: '砂 算数',  color: '#5c4a1a', height: 80,  bookmarked: false, pages: ['無限の砂漠で発見した、\n数式の美しさ。\n\n砂粒の数も\n無限に追えば詩になる。'] },
    { title: '白い部屋',       author: '白 静香',  color: '#3a3a4a', height: 65,  bookmarked: true,  pages: ['何もない部屋に\n座り続けた女の話。\n\n空白の中にこそ\n全てがある。'] },
    { title: '時計の国',       author: '時 刻也',  color: '#4a1a1a', height: 90,  bookmarked: false, pages: ['時間が逆に流れる国の\n冒険記。\n\n未来から来た男は\n何を知っていたか。'] },
    { title: '葉脈の地図',     author: '緑 一葉',  color: '#1a4a2d', height: 75,  bookmarked: false, pages: ['一枚の葉に宇宙を見た\n植物学者の記録。\n\n葉の筋は\n世界地図に似ている。'] },
    { title: '石の言葉',       author: '岩 古人',  color: '#3a3020', height: 85,  bookmarked: true,  pages: ['何千年も沈黙してきた\n石が語り始めた。\n\n石は全てを\n知っている。'] },
    { title: '月の裏側',       author: '月 輝夜',  color: '#2a1a4a', height: 100, bookmarked: false, pages: ['誰も見たことのない\n月の裏側の物語。\n\n見えないから\n美しいのかもしれない。'] },
  ]
};

// ===== 本を描画 =====
function renderRow(data, rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;

  data.forEach(book => {
    const spine = document.createElement('div');
    spine.className = 'book-spine' + (book.bookmarked ? ' bookmarked' : '');
    spine.style.background = book.color;
    spine.style.height = book.height + 'px';
    spine.style.width  = '28px';
    spine.textContent  = book.title;

    // ポップアップ
    const popup = document.createElement('div');
    popup.className = 'book-popup';
    popup.innerHTML = `
      <div class="popup-title">${book.title}</div>
      <div class="popup-author">${book.author}</div>
      <div class="popup-summary">${book.pages[0].slice(0, 40)}…</div>
    `;
    spine.appendChild(popup);

    // クリックでビューワーを開く
    spine.addEventListener('click', () => openViewer(book));
    row.appendChild(spine);
  });
}

renderRow(booksData.row1, 'shelfRow1');
renderRow(booksData.row2, 'shelfRow2');
renderRow(booksData.row3, 'shelfRow3');