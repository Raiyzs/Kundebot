(function () {
  // Config — sett automatisk fra script-taggen: <script src="widget.js" data-server="https://..." data-color="#0066ff" data-name="Kundeservice">
  const script  = document.currentScript || document.querySelector('script[data-server]');
  const SERVER  = (script && script.dataset.server)  || 'http://127.0.0.1:3100';
  const COLOR   = (script && script.dataset.color)   || '#0066ff';
  const NAME    = (script && script.dataset.name)    || 'Kundeservice';
  const LOGO    = (script && script.dataset.logo)    || '';

  // ── Inject CSS ──────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #_aichat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 99999;
      width: 56px; height: 56px; border-radius: 50%;
      background: ${COLOR}; border: none; cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.25);
      display: flex; align-items: center; justify-content: center;
      transition: transform .15s;
    }
    #_aichat-btn:hover { transform: scale(1.08); }
    #_aichat-btn svg { width: 26px; height: 26px; fill: #fff; }

    #_aichat-box {
      position: fixed; bottom: 92px; right: 24px; z-index: 99998;
      width: 340px; max-height: 520px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: none; flex-direction: column; overflow: hidden;
      font-family: system-ui, sans-serif; font-size: 14px;
    }
    #_aichat-box.open { display: flex; }

    #_aichat-header {
      background: ${COLOR}; color: #fff;
      padding: 14px 16px; display: flex; align-items: center; gap: 10px;
      font-weight: 600; font-size: 15px;
    }
    #_aichat-header img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
    #_aichat-header span { flex: 1; }
    #_aichat-close {
      background: none; border: none; color: #fff;
      font-size: 20px; cursor: pointer; padding: 0 4px; line-height: 1;
    }

    #_aichat-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
      min-height: 200px; max-height: 340px;
    }

    .aic-msg {
      max-width: 82%; padding: 10px 13px; border-radius: 14px;
      line-height: 1.45; word-break: break-word;
    }
    .aic-msg.bot  { background: #f1f3f5; color: #1a1a1a; align-self: flex-start; border-bottom-left-radius: 4px; }
    .aic-msg.user { background: ${COLOR}; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
    .aic-msg.typing { color: #888; font-style: italic; }

    #_aichat-footer {
      padding: 10px 12px; border-top: 1px solid #eee;
      display: flex; gap: 8px; align-items: flex-end;
    }
    #_aichat-input {
      flex: 1; border: 1px solid #ddd; border-radius: 10px;
      padding: 9px 12px; font-size: 14px; resize: none;
      outline: none; font-family: inherit; max-height: 100px;
      line-height: 1.4;
    }
    #_aichat-input:focus { border-color: ${COLOR}; }
    #_aichat-send {
      background: ${COLOR}; border: none; border-radius: 10px;
      color: #fff; padding: 9px 14px; cursor: pointer;
      font-size: 14px; font-weight: 600; white-space: nowrap;
    }
    #_aichat-send:disabled { opacity: 0.5; cursor: default; }
  `;
  document.head.appendChild(style);

  // ── Build DOM ───────────────────────────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = '_aichat-btn';
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/></svg>`;

  const box = document.createElement('div');
  box.id = '_aichat-box';
  box.innerHTML = `
    <div id="_aichat-header">
      ${LOGO ? `<img src="${LOGO}" alt="">` : ''}
      <span>${NAME}</span>
      <button id="_aichat-close">×</button>
    </div>
    <div id="_aichat-messages"></div>
    <div id="_aichat-footer">
      <textarea id="_aichat-input" rows="1" placeholder="Skriv en melding…"></textarea>
      <button id="_aichat-send">Send</button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // ── State ───────────────────────────────────────────────────────────────────
  const messages  = document.getElementById('_aichat-messages');
  const input     = document.getElementById('_aichat-input');
  const sendBtn   = document.getElementById('_aichat-send');
  let history     = [];
  let open        = false;

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function addMsg(role, text) {
    const el = document.createElement('div');
    el.className = `aic-msg ${role}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  function showGreeting() {
    if (messages.children.length === 0)
      addMsg('bot', `Hei! 👋 Jeg er ${NAME} sin AI-assistent. Hvordan kan jeg hjelpe deg?`);
  }

  async function send() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    input.value = '';
    input.style.height = 'auto';
    addMsg('user', text);

    sendBtn.disabled = true;
    const typing = addMsg('bot typing', 'Skriver…');

    try {
      const res = await fetch(`${SERVER}/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      typing.remove();
      const reply = data.reply || 'Beklager, noe gikk galt.';
      addMsg('bot', reply);
      history.push({ role: 'user', content: text });
      history.push({ role: 'assistant', content: reply });
      if (history.length > 20) history = history.slice(-20);
    } catch {
      typing.remove();
      addMsg('bot', 'Beklager, jeg klarte ikke å koble til. Prøv igjen.');
    }

    sendBtn.disabled = false;
    input.focus();
  }

  // ── Events ──────────────────────────────────────────────────────────────────
  btn.addEventListener('click', () => {
    open = !open;
    box.classList.toggle('open', open);
    if (open) { showGreeting(); input.focus(); }
  });

  document.getElementById('_aichat-close').addEventListener('click', () => {
    open = false;
    box.classList.remove('open');
  });

  sendBtn.addEventListener('click', send);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });
})();
