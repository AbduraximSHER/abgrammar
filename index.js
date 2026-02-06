// --- REFINED TRANSLATION SYSTEM (Index Page) ---
let dictEnabled = localStorage.getItem('dict_enabled') === 'true';

// Toggle Dictionary Mode (called by UI)
function toggleDict() {
  const toggle = document.getElementById('dict-toggle');
  if (!toggle) return;

  dictEnabled = !!toggle.checked;
  window.DICTIONARY_MODE_ON = dictEnabled; // sync with unified logic
  localStorage.setItem('dict_enabled', String(dictEnabled));

  showToast(`Dictionary Mode: ${dictEnabled ? 'ON' : 'OFF'}`, 'info');
}

// Initialize toggle state safely on this page only
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('dict-toggle');
  if (toggle) {
    toggle.checked = dictEnabled;
    window.DICTIONARY_MODE_ON = dictEnabled;
  }
});

// Legacy wrapWords (stub) to prevent breakage if old render calls exist
function wrapWords(html) { return html; }

// Utility: Toast Notifications (Index Page)
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutLeft 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);

  toast.onclick = () => toast.remove();
}
