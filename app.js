document.addEventListener('DOMContentLoaded', () => {
  const fetchBtn = document.getElementById('fetchBtn');
  const statusMsg = document.getElementById('statusMsg');
  const gallery = document.getElementById('gallery');
  const galleryPlaceholder = document.getElementById('galleryPlaceholder');
  const paramsForm = document.getElementById('paramsForm');

  function showStatus(message, isError = false) {
    statusMsg.textContent = message;
    statusMsg.classList.toggle('hidden', !message);
    statusMsg.classList.toggle('error', isError);
  }

  function clearGallery() {
    // 保留占位元素结构，移除其它 card
    Array.from(gallery.querySelectorAll('.card')).forEach(n => n.remove());
  }

  function getSelectedSizes() {
    const checks = Array.from(document.querySelectorAll('.size-checkbox'));
    const selected = checks.filter(c => c.checked).map(c => c.value);
    return selected.length ? selected : ['original'];
  }

  function buildPayload() {
    const r18 = parseInt(document.getElementById('r18').value, 10) || 0;
    let num = parseInt(document.getElementById('num').value, 10) || 1;
    num = Math.min(Math.max(num, 1), 20);

    const keyword = document.getElementById('keyword').value.trim() || undefined;
    const tagRaw = document.getElementById('tag').value.trim();
    let tag;
    if (tagRaw) {
      // 支持用英文逗号分隔多个字符串，每项内部可包含 | 表示 OR
      tag = tagRaw.split(',').map(s => s.trim()).filter(Boolean);
    }

    const size = getSelectedSizes();
    const proxy = (document.getElementById('proxy').value || '').trim() || undefined;
    const excludeAIVal = document.getElementById('excludeAI').value;
    const excludeAI = excludeAIVal === 'true' || excludeAIVal === '1';
    const aspectRatio = (document.getElementById('aspectRatio').value || '').trim() || undefined;

    const body = { r18, num };
    if (keyword) body.keyword = keyword;
    if (tag) body.tag = tag;
    if (size) body.size = size;
    if (proxy) body.proxy = proxy;
    if (excludeAI) body.excludeAI = true;
    if (aspectRatio) body.aspectRatio = aspectRatio;

    return body;
  }

  function chooseUrlForSetu(setu, preferredSizes) {
    // 優先使用用户选择的 size 顺序
    for (const s of preferredSizes) {
      if (setu.urls && setu.urls[s]) return setu.urls[s];
    }
    // 否则使用返回的第一个可用 url
    if (setu.urls) {
      for (const v of Object.values(setu.urls)) if (v) return v;
    }
    return null;
  }

  function renderGallery(data, preferredSizes) {
    clearGallery();
    if (!Array.isArray(data) || data.length === 0) {
      galleryPlaceholder.style.display = '';
      showStatus('没有找到符合条件的图片。', false);
      return;
    }

    galleryPlaceholder.style.display = 'none';

    data.forEach(item => {
      const url = chooseUrlForSetu(item, preferredSizes);
      if (!url) return;

      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = url;
      img.alt = `${item.title || 'Untitled'} by ${item.author || 'unknown'}`;
      img.loading = 'lazy';
      card.appendChild(img);

      const meta = document.createElement('div');
      meta.className = 'meta';

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = item.title || '(无标题)';
      meta.appendChild(title);

      const author = document.createElement('div');
      author.className = 'author';
      author.textContent = `作者: ${item.author || '未知'} (uid:${item.uid || '-'})`;
      meta.appendChild(author);

      const info = document.createElement('div');
      info.className = 'info';
      const parts = [];
      if (item.r18) parts.push('R18');
      if (Array.isArray(item.tags) && item.tags.length) parts.push(item.tags.slice(0, 10).join(', '));
      info.textContent = parts.join(' | ');
      meta.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'actions';
      const openBtn = document.createElement('a');
      openBtn.className = 'open-btn';
      openBtn.href = url;
      openBtn.target = '_blank';
      openBtn.rel = 'noopener';
      openBtn.textContent = '打开原图';
      actions.appendChild(openBtn);

      card.appendChild(meta);
      card.appendChild(actions);

      // 在 gallery 中插入 card，放在占位元素之后
      gallery.appendChild(card);
    });

    showStatus(`已加载 ${gallery.querySelectorAll('.card').length} 张图片。`, false);
  }

  async function fetchSetu() {
    const body = buildPayload();
    showStatus('请求中…');

    try {
      const res = await fetch('https://api.lolicon.app/setu/v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`网络错误: ${res.status} ${res.statusText}`);

      const json = await res.json();
      if (json.error) {
        showStatus(`API 错误: ${json.error}`, true);
        return;
      }

      const preferredSizes = getSelectedSizes();
      renderGallery(json.data || [], preferredSizes);
    } catch (err) {
      console.error(err);
      showStatus(`请求失败: ${err.message}`, true);
    }
  }

  // 点击按钮触发
  fetchBtn.addEventListener('click', () => {
    fetchSetu();
  });

  // 回车在表单内触发查询
  paramsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchSetu();
  });

  // 支持回车触发（当按下 Enter 时提交表单）
  paramsForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      fetchSetu();
    }
  });
});
