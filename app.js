// =============================================
//  Lolicon API v2 — 随机色图 Web 客户端
// =============================================

// 使用 CORS 代理（推荐自建，公共代理仅供开发测试）
const API_BASE = "https://api.lolicon.app/setu/v2";
const CORS_PROXY = "https://corsproxy.io/?";
const API_URL = CORS_PROXY + encodeURIComponent(API_BASE);


// DOM 节点
const fetchBtn = document.getElementById("fetchBtn");
const gallery = document.getElementById("gallery");
const galleryPlaceholder = document.getElementById("galleryPlaceholder");
const statusMsg = document.getElementById("statusMsg");

// ——— 工具函数 ———

/**
 * 读取参数面板，返回请求体对象
 */
function buildParams() {
  const params = {};

  // r18
  const r18 = parseInt(document.getElementById("r18").value, 10);
  params.r18 = r18;

  // num
  const num = parseInt(document.getElementById("num").value, 10);
  if (num >= 1 && num <= 20) params.num = num;

  // keyword
  const keyword = document.getElementById("keyword").value.trim();
  if (keyword) params.keyword = keyword;

  // tag — 逗号分隔为多个标签条件（AND），每个内部可用 | 表示 OR
  const tagRaw = document.getElementById("tag").value.trim();
  if (tagRaw) {
    const tags = tagRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length > 0) params.tag = tags;
  }

  // size — 复选框
  const sizeChecked = [
    ...document.querySelectorAll('input[name="size"]:checked'),
  ].map((cb) => cb.value);
  if (sizeChecked.length > 0) params.size = sizeChecked;

  // excludeAI
  const excludeAI = document.getElementById("excludeAI").value;
  params.excludeAI = excludeAI === "true";

  // aspectRatio
  const aspectRatio = document.getElementById("aspectRatio").value.trim();
  if (aspectRatio) params.aspectRatio = aspectRatio;

  // proxy
  const proxy = document.getElementById("proxy").value.trim();
  if (proxy) params.proxy = proxy;

  return params;
}

/**
 * 显示状态消息
 * @param {string} msg
 * @param {'info'|'error'} type
 */
function showStatus(msg, type = "info") {
  statusMsg.textContent = msg;
  statusMsg.className = `status-msg ${type}`;
}

function hideStatus() {
  statusMsg.className = "status-msg hidden";
}

/**
 * 设置按钮加载状态
 */
function setLoading(isLoading) {
  fetchBtn.disabled = isLoading;
  fetchBtn.classList.toggle("loading", isLoading);
  fetchBtn.querySelector(".btn-icon").textContent = isLoading ? "⏳" : "✨";
  fetchBtn.querySelector(".btn-text").textContent = isLoading
    ? "获取中..."
    : "获取色图";
}

// ——— 渲染函数 ———

/**
 * 渲染图片列表到 gallery
 * @param {Array} setuList
 */
function renderGallery(setuList) {
  // 清空旧内容（保留 placeholder 供后续重用）
  gallery.innerHTML = "";

  if (setuList.length === 0) {
    gallery.innerHTML =
      '<div class="gallery-placeholder"><span>😔</span><p>没有找到匹配的图片，请调整参数后重试</p></div>';
    return;
  }

  const grid = document.createElement("div");
  grid.className = "gallery-grid";

  setuList.forEach((setu, idx) => {
    const card = createCard(setu, idx);
    grid.appendChild(card);
  });

  gallery.appendChild(grid);
}

/**
 * 创建单张图片卡片
 */
function createCard(setu, idx) {
  const card = document.createElement("div");
  card.className = "setu-card";
  card.style.animationDelay = `${idx * 0.06}s`;

  // 优先选择第一个可用图片地址
  const urls = setu.urls || {};
  const sizePriority = ["original", "regular", "small", "thumb", "mini"];
  let imgUrl = null;
  for (const s of sizePriority) {
    if (urls[s]) {
      imgUrl = urls[s];
      break;
    }
  }

  // aiType: 0=未知, 1=非AI, 2=AI
  const aiLabel =
    setu.aiType === 2 ? "AI" : setu.aiType === 1 ? null : null;

  card.innerHTML = `
    ${
      imgUrl
        ? `<img src="${imgUrl}" alt="${escapeHtml(setu.title)}" loading="lazy" title="点击查看大图" />`
        : `<div style="height:200px;display:flex;align-items:center;justify-content:center;color:#555;font-size:0.85rem;">图片地址不可用</div>`
    }
    <div class="card-info">
      <div class="title-text" title="${escapeHtml(setu.title)}">${escapeHtml(setu.title)}</div>
      <div class="author-text">✏️ ${escapeHtml(setu.author)}</div>
      <div class="tags-text">🏷 ${setu.tags.map(escapeHtml).join(" · ")}</div>
      <div class="meta-row">
        ${setu.r18 ? '<span class="badge r18">R18</span>' : ""}
        ${aiLabel ? `<span class="badge ai">${aiLabel}</span>` : ""}
        <span class="badge pid">PID: ${setu.pid}</span>
        <span class="badge pid">${setu.width} × ${setu.height}</span>
      </div>
      <a class="card-link" href="https://www.pixiv.net/artworks/${setu.pid}" target="_blank" rel="noopener noreferrer">🔗 在 Pixiv 查看原作</a>
    </div>
  `;

  // 点击图片打开灯箱
  if (imgUrl) {
    const img = card.querySelector("img");
    img.addEventListener("click", () => openLightbox(imgUrl, setu.title));
  }

  return card;
}

/**
 * 防 XSS：转义 HTML 字符
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ——— 灯箱 ———

function openLightbox(url, title) {
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `<img src="${url}" alt="${escapeHtml(title)}" />`;

  // 点击遮罩关闭（不点图片本身）
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox(lb);
  });

  // ESC 关闭
  const onKey = (e) => {
    if (e.key === "Escape") {
      closeLightbox(lb);
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);

  document.body.appendChild(lb);
}

function closeLightbox(lb) {
  lb.style.opacity = "0";
  lb.style.transition = "opacity 0.2s";
  setTimeout(() => lb.remove(), 200);
}

// ——— 核心请求 ———

async function fetchSetu() {
  hideStatus();
  setLoading(true);

  try {
    const params = buildParams();

    // ——— 关键改动：用 no-cors 模式 + 文本解析 ———
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(params),
      // 注意：corsproxy.io 配合 POST 时需用 mode: 'cors'
      // 如果仍失败，改用下方的纯文本方案
    });

    // 经过 corsproxy.io 代理后，响应被包装成字符串
    const text = await response.text();
    const json = JSON.parse(text);

    if (json.error) {
      throw new Error(`API 错误：${json.error}`);
    }

    const data = json.data || [];
    showStatus(`✅ 成功获取 ${data.length} 张图片`, "info");
    renderGallery(data);
  } catch (err) {
    showStatus(`❌ ${err.message}`, "error");
    console.error("[Lolicon]", err);
  } finally {
    setLoading(false);
  }
}


// ——— 事件绑定 ———
fetchBtn.addEventListener("click", fetchSetu);
