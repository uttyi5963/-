// Shared UI helpers: modal, toast, escape, element helpers.

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function toast(message, ms = 2000) {
  let t = document.getElementById('app-toast');
  if (!t) {
    t = el('div', { id: 'app-toast', class: 'toast' });
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), ms);
}

// Modal API: openModal({ title, body, footer, onClose })
let activeOnClose = null;

export function openModal({ title, body, footer, onClose }) {
  const backdrop = document.getElementById('app-modal');
  backdrop.querySelector('.modal-head h2').textContent = title || '';
  const bodyEl = backdrop.querySelector('.modal-body');
  const footEl = backdrop.querySelector('.modal-foot');
  bodyEl.innerHTML = '';
  footEl.innerHTML = '';
  if (body) bodyEl.appendChild(body);
  if (footer) footEl.appendChild(footer); else footEl.style.display = 'none';
  if (footer) footEl.style.display = '';
  backdrop.classList.add('open');
  activeOnClose = onClose || null;
  document.body.style.overflow = 'hidden';
}

export function closeModal() {
  const backdrop = document.getElementById('app-modal');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
  if (activeOnClose) {
    const fn = activeOnClose;
    activeOnClose = null;
    try { fn(); } catch (e) { console.error(e); }
  }
}

export function initModal() {
  const backdrop = document.getElementById('app-modal');
  if (!backdrop) return;
  backdrop.querySelector('.close').addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
  });
}

export function pct(n) {
  return `${Math.max(0, Math.min(100, Math.round(n)))}%`;
}

// Pluralizer for English count strings (e.g. word/words).
export function plural(n, singular, plural) {
  return n === 1 ? `${n} ${singular}` : `${n} ${plural || singular + 's'}`;
}
