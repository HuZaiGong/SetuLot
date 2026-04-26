const API_URL = 'https://api.lolicon.app/setu/v2';

// State
let state = {
  images: [],
  currentIndex: 0,
  tags: [],
  favorites: JSON.parse(localStorage.getItem('setu_favorites') || '[]'),
  theme: localStorage.getItem('setu_theme') || 'dark',
  r18Confirmed: localStorage.getItem('setu_r18_confirmed') === 'true',
  proxy: 'i.pixiv.re'
};

// DOM Elements
const elements = {
  gallery: document.getElementById('gallery'),
  loading: document.getElementById('loading'),
  emptyState: document.getElementById('emptyState'),
  errorState: document.getElementById('errorState'),
  errorMsg: document.getElementById('errorMsg'),
  imageModal: document.getElementById('imageModal'),
  r18Modal: document.getElementById('r18Modal'),
  toast: document.getElementById('toast'),
  modalImage: document.getElementById('modalImage'),
  modalTitle: document.getElementById('modalTitle'),
  modalAuthor: document.getElementById('modalAuthor'),
  modalTags: document.getElementById('modalTags'),
  modalR18: document.getElementById('modalR18'),
  modalAI: document.getElementById('modalAI'),
  modalSize: document.getElementById('modalSize'),
  tagList: document.getElementById('tagList')
};

// API Functions
async function fetchSetu(params = {}) {
  const defaultParams = {
    num: 10,
    r18: 0,
    size: ['regular', 'original'],
    proxy: 'i.pixiv.re'
  };
  
  const requestParams = { ...defaultParams, ...params };
  
  if (requestParams.tag && requestParams.tag.length > 0) {
    requestParams.tag = requestParams.tag.map(t => t.split('|')[0]);
  }
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestParams)
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.data || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Render Functions
function renderImages(images) {
  if (images.length === 0) {
    elements.gallery.classList.add('hidden');
    elements.emptyState.classList.remove('hidden');
    return;
  }
  
  elements.emptyState.classList.add('hidden');
  elements.gallery.classList.remove('hidden');
  elements.gallery.innerHTML = images.map((img, index) => {
    const url = img.urls.regular || img.urls.small || img.urls.thumb || img.urls.mini || Object.values(img.urls)[0];
    const isFavorite = state.favorites.includes(img.pid);
    const aspectRatio = img.height / img.width;
    const height = Math.round(200 / aspectRatio);
    
    return `
      <div class="masonry-item fade-in" style="animation-delay: ${index * 50}ms">
        <div class="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-200 dark:bg-dark-card hover:shadow-xl transition-shadow"
          onclick="openModal(${index})">
          <img src="${url}" alt="${img.title}" loading="lazy"
            class="w-full ${img.r18 && !state.r18Confirmed ? 'blur-r18' : ''}"
            style="height: ${height}px; object-fit: cover;">
          
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="absolute bottom-0 left-0 right-0 p-3">
              <p class="text-white font-medium text-sm truncate">${img.title}</p>
              <p class="text-white/70 text-xs truncate">${img.author}</p>
            </div>
          </div>
          
          ${img.r18 ? '<span class="absolute top-2 left-2 px-2 py-0.5 bg-red-500/80 text-white text-xs rounded-full">R18</span>' : ''}
          ${img.aiType === 2 ? '<span class="absolute top-2 right-2 px-2 py-0.5 bg-blue-500/80 text-white text-xs rounded-full">AI</span>' : ''}
          <button class="absolute top-2 right-2 p-1.5 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isFavorite ? 'opacity-100' : ''}"
            onclick="event.stopPropagation(); toggleFavorite(${img.pid})">
            <svg class="w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white'}" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function renderTagList() {
  elements.tagList.innerHTML = state.tags.map((tag, index) => `
    <span class="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
      ${tag}
      <button onclick="removeTag(${index})" class="hover:text-red-500">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </span>
  `).join('');
}

// Modal Functions
function openModal(index) {
  state.currentIndex = index;
  updateModalContent();
  elements.imageModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  elements.imageModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function updateModalContent() {
  const img = state.images[state.currentIndex];
  if (!img) return;
  
  const size = document.getElementById('sizeSelect').value;
  const url = img.urls[size] || img.urls.original || Object.values(img.urls)[0];
  
  elements.modalImage.src = url;
  elements.modalTitle.textContent = img.title;
  elements.modalAuthor.textContent = `${img.author} • ${img.width}×${img.height}`;
  elements.modalSize.textContent = size;
  
  elements.modalR18.classList.toggle('hidden', !img.r18);
  elements.modalAI.classList.toggle('hidden', img.aiType !== 2);
  
  elements.modalTags.innerHTML = img.tags.slice(0, 10).map(tag => 
    `<span class="px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded-full">${tag}</span>`
  ).join('');
  
  const isFavorite = state.favorites.includes(img.pid);
  const favBtn = document.getElementById('modalFavorite');
  if (isFavorite) {
    favBtn.querySelector('svg').classList.add('fill-red-500', 'text-red-500');
  } else {
    favBtn.querySelector('svg').classList.remove('fill-red-500', 'text-red-500');
  }
}

function navigateModal(direction) {
  const newIndex = state.currentIndex + direction;
  if (newIndex >= 0 && newIndex < state.images.length) {
    state.currentIndex = newIndex;
    updateModalContent();
  }
}

// Favorites
function toggleFavorite(pid) {
  const index = state.favorites.indexOf(pid);
  if (index === -1) {
    state.favorites.push(pid);
    showToast('已添加到收藏');
  } else {
    state.favorites.splice(index, 1);
    showToast('已取消收藏');
  }
  localStorage.setItem('setu_favorites', JSON.stringify(state.favorites));
  renderImages(state.images);
}

// Tags
function addTag(tag) {
  if (tag && !state.tags.includes(tag) && state.tags.length < 6) {
    state.tags.push(tag);
    renderTagList();
  }
}

function removeTag(index) {
  state.tags.splice(index, 1);
  renderTagList();
}

// Toast
function showToast(message) {
  const toast = elements.toast;
  toast.querySelector('div').textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

// Theme
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.classList.toggle('dark', state.theme === 'dark');
  localStorage.setItem('setu_theme', state.theme);
}

// Load Data
async function loadImages() {
  elements.loading.classList.remove('hidden');
  elements.gallery.classList.add('hidden');
  elements.emptyState.classList.add('hidden');
  elements.errorState.classList.add('hidden');
  
  try {
    const params = {
      num: parseInt(document.getElementById('numInput').value) || 10,
      r18: parseInt(document.getElementById('r18Select').value),
      keyword: document.getElementById('searchInput').value,
      tag: state.tags.length > 0 ? state.tags : undefined,
      aspectRatio: document.getElementById('aspectSelect').value,
      excludeAI: document.getElementById('excludeAI').checked
    };
    
    const data = await fetchSetu(params);
    state.images = data;
    renderImages(data);
  } catch (error) {
    elements.errorMsg.textContent = error.message || '加载失败';
    elements.errorState.classList.remove('hidden');
  } finally {
    elements.loading.classList.add('hidden');
  }
}

// Event Listeners
document.getElementById('refreshBtn').addEventListener('click', loadImages);
document.getElementById('applyFilter').addEventListener('click', loadImages);
document.getElementById('retryBtn').addEventListener('click', loadImages);
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

document.getElementById('tagInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addTag(e.target.value.trim());
    e.target.value = '';
  }
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loadImages();
  }
});

// Modal Events
document.getElementById('modalBackdrop').addEventListener('click', closeModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('prevImage').addEventListener('click', () => navigateModal(-1));
document.getElementById('nextImage').addEventListener('click', () => navigateModal(1));
document.getElementById('sizeSelect').addEventListener('change', updateModalContent);

document.getElementById('modalDownload').addEventListener('click', () => {
  const img = state.images[state.currentIndex];
  if (img) {
    const link = document.createElement('a');
    link.href = img.urls.original || Object.values(img.urls)[0];
    link.download = `${img.title}_${img.pid}.${img.ext}`;
    link.target = '_blank';
    link.click();
  }
});

document.getElementById('modalFavorite').addEventListener('click', () => {
  const img = state.images[state.currentIndex];
  if (img) {
    toggleFavorite(img.pid);
    updateModalContent();
  }
});

// R18 Modal
document.getElementById('r18Confirm').addEventListener('click', () => {
  state.r18Confirmed = true;
  localStorage.setItem('setu_r18_confirmed', 'true');
  elements.r18Modal.classList.add('hidden');
  loadImages();
});

document.getElementById('r18Cancel').addEventListener('click', () => {
  elements.r18Modal.classList.add('hidden');
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
  if (!elements.imageModal.classList.contains('hidden')) {
    switch (e.key) {
      case 'ArrowLeft':
        navigateModal(-1);
        break;
      case 'ArrowRight':
        navigateModal(1);
        break;
      case 'Escape':
        closeModal();
        break;
    }
  }
});

// Initialize
function init() {
  document.documentElement.classList.toggle('dark', state.theme === 'dark');
  
  if (!state.r18Confirmed) {
    elements.r18Modal.classList.remove('hidden');
  } else {
    loadImages();
  }
}

init();