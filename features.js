/**
 * features.js — ABGrammar Feature Pack
 * Dark mode, gamification, bookmarks, and PWA support.
 * Loaded as a standalone module on all pages.
 */

/* ══════════════════════════════════════════
   1. DARK MODE
   ══════════════════════════════════════════ */
const DarkMode = {
  KEY: 'abg_theme',

  init() {
    const saved = localStorage.getItem(this.KEY);
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else if (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.KEY)) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : '');
      }
    });

    this._injectToggle();
  },

  toggle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(this.KEY, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(this.KEY, 'dark');
    }
    this._updateIcon();
  },

  _injectToggle() {
    if (document.getElementById('dark-mode-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'dark-mode-toggle';
    btn.className = 'dark-mode-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.addEventListener('click', () => this.toggle());
    document.body.appendChild(btn);
    this._updateIcon();
  },

  _updateIcon() {
    const btn = document.getElementById('dark-mode-toggle');
    if (!btn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = isDark ? '☀️' : '🌙';
  }
};

/* ══════════════════════════════════════════
   2. GAMIFICATION
   ══════════════════════════════════════════ */
const Gamification = {
  PREFIX: 'abg_user_',

  _getUserId() {
    let id = localStorage.getItem('abg_user_id');
    if (!id) {
      id = 'u_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      localStorage.setItem('abg_user_id', id);
    }
    return id;
  },

  getData() {
    try {
      const raw = localStorage.getItem(this.PREFIX + this._getUserId());
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    const defaults = { points: 0, streak: { current: 0, lastDate: null }, badges: [], bookmarks: [] };
    this.save(defaults);
    return defaults;
  },

  save(data) {
    try {
      localStorage.setItem(this.PREFIX + this._getUserId(), JSON.stringify(data));
    } catch (e) { /* ignore */ }
  },

  addPoints(amount, reason) {
    const d = this.getData();
    d.points = (d.points || 0) + amount;
    this.save(d);
    if (reason) this._toast(`+${amount} pts — ${reason}`, 'success');
  },

  trackStreak() {
    const d = this.getData();
    const today = new Date().toDateString();
    const last = d.streak.lastDate;

    if (last === today) return; // already tracked today

    if (!last) {
      d.streak.current = 1;
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      d.streak.current = (last === yesterday) ? d.streak.current + 1 : 1;
    }

    d.streak.lastDate = today;
    this.save(d);

    if (d.streak.current > 1) {
      this._toast(`🔥 ${d.streak.current}-day streak!`, 'info');
    }

    this._checkBadges();
  },

  _checkBadges() {
    const d = this.getData();
    const completed = JSON.parse(localStorage.getItem('completedTopics') || '[]');
    const badges = d.badges || [];
    const has = id => badges.some(b => b.id === id);

    const defs = [
      { id: 'first_lesson', name: 'First Step', check: () => completed.length >= 1 },
      { id: 'ten_done', name: 'Dedicated Learner', check: () => completed.length >= 10 },
      { id: 'fifty_done', name: 'Grammar Expert', check: () => completed.length >= 50 },
      { id: 'streak_7', name: 'Week Warrior', check: () => d.streak.current >= 7 },
      { id: 'streak_30', name: 'Monthly Master', check: () => d.streak.current >= 30 },
    ];

    defs.forEach(def => {
      if (!has(def.id) && def.check()) {
        badges.push({ id: def.id, name: def.name, at: new Date().toISOString() });
        this._toast(`🏅 Badge unlocked: ${def.name}!`, 'success');
        this.addPoints(50, `"${def.name}" badge`);
      }
    });

    d.badges = badges;
    this.save(d);
  },

  _toast(msg, type = 'info') {
    const colors = {
      success: { bg: '#ecfdf5', border: '#10b981', text: '#065f46' },
      info: { bg: '#eff6ff', border: '#3b82f6', text: '#1e3a5a' },
      warning: { bg: '#fffbeb', border: '#f59e0b', text: '#78350f' }
    };
    const darkColors = {
      success: { bg: '#064e3b', border: '#34d399', text: '#d1fae5' },
      info: { bg: '#1e3a5a', border: '#60a5fa', text: '#dbeafe' },
      warning: { bg: '#451a03', border: '#fbbf24', text: '#fef3c7' }
    };
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const c = (isDark ? darkColors : colors)[type] || colors.info;

    let container = document.getElementById('abg-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'abg-toast-container';
      container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:8px;max-width:340px;pointer-events:none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `background:${c.bg};border:1px solid ${c.border};border-left:4px solid ${c.border};color:${c.text};padding:12px 16px;border-radius:10px;font:0.9rem/1.5 var(--font-body, system-ui);box-shadow:0 4px 12px rgba(0,0,0,0.12);pointer-events:all;cursor:pointer;opacity:0;transform:translateX(40px);transition:all 0.3s ease;`;
    toast.textContent = msg;
    toast.onclick = () => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); };
    container.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(0)'; });
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(40px)'; setTimeout(() => toast.remove(), 300); }, 4000);
  }
};

/* ══════════════════════════════════════════
   3. BOOKMARKS
   ══════════════════════════════════════════ */
const Bookmarks = {
  KEY: 'abg_bookmarks',

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); }
    catch { return []; }
  },

  toggle(topicId, topicTitle) {
    const all = this.getAll();
    const idx = all.findIndex(b => b.id === topicId);
    if (idx > -1) {
      all.splice(idx, 1);
      Gamification._toast(`Bookmark removed: ${topicTitle}`, 'info');
    } else {
      all.push({ id: topicId, title: topicTitle, at: new Date().toISOString() });
      Gamification._toast(`Bookmarked: ${topicTitle}`, 'success');
    }
    localStorage.setItem(this.KEY, JSON.stringify(all));
    return idx === -1; // true if added
  },

  isBookmarked(topicId) {
    return this.getAll().some(b => b.id === topicId);
  }
};

/* ══════════════════════════════════════════
   4. PWA / SERVICE WORKER
   ══════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

/* ══════════════════════════════════════════
   INIT — Run on every page
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  DarkMode.init();
  Gamification.trackStreak();
});

// Export to window for use by other scripts
window.DarkMode = DarkMode;
window.Gamification = Gamification;
window.Bookmarks = Bookmarks;
