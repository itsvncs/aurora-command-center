/* =========================================================
   v3 — EXPANSION PACK
   Depende de globals já definidos em app.js
   ========================================================= */
/* eslint-disable no-undef */

(function v3() {
  if (typeof haFetch !== "function") { console.warn("v3: app.js não carregado"); return; }

  /* ---------- Settings: itens persistentes ---------- */
  const SETTINGS_KEY = "auroraSettingsV3";
  function getSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); } catch { return {}; }
  }
  function setSettings(p) {
    const cur = getSettings();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...cur, ...p }));
  }

  /* =========================================================
     #23 · URL configurável do HA  (proxy via localStorage)
     ========================================================= */
  const HA_URL_KEY = "auroraHaUrl";
  const _origFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      const base = localStorage.getItem(HA_URL_KEY);
      if (base && typeof input === "string" && input.startsWith("/api/")) {
        return _origFetch(base.replace(/\/$/, "") + input, init);
      }
    } catch {}
    return _origFetch(input, init);
  };

  /* =========================================================
     #4 · Energia
     ========================================================= */
  async function getPowerEntities() {
    try {
      const all = Object.values(state.entities || {});
      return all.filter((e) =>
        e.entity_id.startsWith("sensor.") &&
        ((e.attributes?.device_class === "power") ||
         (e.attributes?.unit_of_measurement || "").toLowerCase() === "w")
      );
    } catch { return []; }
  }
  async function getEnergyEntities() {
    const all = Object.values(state.entities || {});
    return all.filter((e) =>
      e.entity_id.startsWith("sensor.") &&
      ((e.attributes?.device_class === "energy") ||
       (e.attributes?.unit_of_measurement || "").toLowerCase() === "kwh")
    );
  }
  async function injectEnergyCard() {
    if (state.route !== "home") return;
    if (view.querySelector(".energy-card")) return;
    const power = await getPowerEntities();
    const energy = await getEnergyEntities();
    if (!power.length && !energy.length) return;
    const total = power.reduce((s, e) => s + (parseFloat(e.state) || 0), 0);
    const dayKwh = energy.reduce((s, e) => s + (parseFloat(e.state) || 0), 0);
    const top = [...power].sort((a, b) => (parseFloat(b.state) || 0) - (parseFloat(a.state) || 0)).slice(0, 3);
    const html = `
      <article class="card energy-card" style="grid-column: span 2;">
        <div class="card-head"><span class="card-title">Energia</span>
          <div class="card-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg></div>
        </div>
        <div class="now">${total.toFixed(0)} W</div>
        <div class="day">${dayKwh.toFixed(2)} kWh hoje</div>
        ${top.length ? `<div class="top3">${top.map(t => `<div class="row"><span>${friendly(t.entity_id, t.entity_id)}</span><b>${parseFloat(t.state).toFixed(0)} W</b></div>`).join("")}</div>` : ""}
      </article>`;
    const grid = view.querySelector(".home-grid");
    if (grid) grid.insertAdjacentHTML("beforeend", html);
  }

  /* =========================================================
     #5 · Cenas/Scripts dinâmicos do HA
     #6 · Automações com toggle
     ========================================================= */
  function listByPrefix(prefix) {
    return Object.values(state.entities || {}).filter((e) => e.entity_id.startsWith(prefix));
  }
  async function openHaAutomationsModal() {
    const scenes = listByPrefix("scene.");
    const scripts = listByPrefix("script.");
    const autos = listByPrefix("automation.");
    openModal(`
      <div class="modal__head">
        <div><h2 class="modal__title">Automações da casa</h2><div class="modal__sub">Scenes · Scripts · Automations</div></div>
        <button class="modal__close" data-modal-close aria-label="Fechar">×</button>
      </div>
      ${scenes.length ? `<div class="modal__section"><div class="modal__label">Cenas (${scenes.length})</div><div class="ha-list">${scenes.map(s => `<div class="row"><div><div class="nm">${friendly(s.entity_id, s.entity_id)}</div><div class="sb">${s.entity_id}</div></div><button class="btn btn--lime" data-run-scene="${s.entity_id}">▶</button></div>`).join("")}</div></div>` : ""}
      ${scripts.length ? `<div class="modal__section"><div class="modal__label">Scripts (${scripts.length})</div><div class="ha-list">${scripts.map(s => `<div class="row"><div><div class="nm">${friendly(s.entity_id, s.entity_id)}</div><div class="sb">${s.entity_id}</div></div><button class="btn" data-run-script="${s.entity_id}">▶</button></div>`).join("")}</div></div>` : ""}
      ${autos.length ? `<div class="modal__section"><div class="modal__label">Automações (${autos.length})</div><div class="ha-list">${autos.map(a => `<div class="row ${a.state==='on'?'is-on':''}" data-auto="${a.entity_id}"><div><div class="nm">${friendly(a.entity_id, a.entity_id)}</div><div class="sb">${a.state==='on'?'Ativa':'Pausada'}</div></div><div class="sw" data-auto-toggle="${a.entity_id}"></div></div>`).join("")}</div></div>` : ""}
      ${!scenes.length && !scripts.length && !autos.length ? `<div class="notif-empty">Nenhuma cena/script/automação encontrada</div>` : ""}
    `);
    sheetEl.querySelectorAll("[data-run-scene]").forEach(b => b.onclick = async () => { try { await callService("scene", "turn_on", {}, { entity_id: b.dataset.runScene }); toast("Cena ativada", "ok"); } catch {} });
    sheetEl.querySelectorAll("[data-run-script]").forEach(b => b.onclick = async () => { try { await callService("script", "turn_on", {}, { entity_id: b.dataset.runScript }); toast("Script executado", "ok"); } catch {} });
    sheetEl.querySelectorAll("[data-auto-toggle]").forEach(b => b.onclick = async () => {
      const id = b.dataset.autoToggle;
      const row = sheetEl.querySelector(`[data-auto="${id}"]`);
      const wasOn = row?.classList.contains("is-on");
      try {
        await callService("automation", wasOn ? "turn_off" : "turn_on", {}, { entity_id: id });
        row?.classList.toggle("is-on");
        toast(wasOn ? "Automação pausada" : "Automação ativa", "ok");
      } catch {}
    });
  }

  /* =========================================================
     #9 · Alertas inteligentes de temperatura
     ========================================================= */
  const TEMP_ALERT = { min: 20, max: 24 };
  let lastTempAlert = 0;
  function checkBabyTempAlert() {
    const t = num(ENTITY_MAP.baby.temp, NaN);
    const fab = document.getElementById("fabBaby");
    if (!Number.isFinite(t) || !fab) return;
    const out = t < TEMP_ALERT.min || t > TEMP_ALERT.max;
    fab.classList.toggle("alert-temp", out);
    if (out && Date.now() - lastTempAlert > 10 * 60 * 1000) {
      lastTempAlert = Date.now();
      toast(`⚠ Quarto Esther ${t.toFixed(1)}° (fora de ${TEMP_ALERT.min}-${TEMP_ALERT.max}°)`, "err", 5000);
      bumpNotifDot?.();
    }
  }
  setInterval(checkBabyTempAlert, 30000);
  setTimeout(checkBabyTempAlert, 5000);

  /* =========================================================
     #10 · Talk-back placeholder (microfone via WebRTC)
     ========================================================= */
  let talkStream = null;
  async function toggleTalkBack(btn) {
    if (talkStream) {
      talkStream.getTracks().forEach(t => t.stop()); talkStream = null;
      btn.classList.remove("is-talking"); toast("Talk-back encerrado", "info");
      return;
    }
    try {
      talkStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      btn.classList.add("is-talking");
      toast("Falando no berço… (configure go2rtc para áudio bidirecional)", "info", 4000);
    } catch (err) {
      toast("Microfone não autorizado", "err");
    }
  }
  function injectTalkBackBtn() {
    if (state.route !== "baby") return;
    const cam = view.querySelector(".baby__cam");
    if (!cam || cam.querySelector(".talk-back")) return;
    const btn = document.createElement("button");
    btn.className = "talk-back";
    btn.title = "Falar no berço";
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 11a7 7 0 0 1-14 0"/><path d="M12 18v3"/></svg>`;
    btn.onclick = () => toggleTalkBack(btn);
    cam.appendChild(btn);
  }

  /* =========================================================
     #11 · Timeline berço (eventos recentes)
     ========================================================= */
  async function injectBabyTimeline() {
    if (state.route !== "baby") return;
    const ctrls = view.querySelector(".baby-ctrls");
    if (!ctrls || view.querySelector(".baby-timeline")) return;
    try {
      const since = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
      const ents = [ENTITY_MAP.baby.occupied, ENTITY_MAP.baby.face].join(",");
      const data = await haFetch(`/api/logbook/${encodeURIComponent(since)}?entity=${ents}`);
      if (!Array.isArray(data) || !data.length) return;
      const items = data.slice(-10).reverse();
      const html = `<div class="baby-timeline">${items.map(it => {
        const ts = it.when ? new Date(it.when).toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit"}) : "";
        return `<div class="it"><span>${(it.message || it.state || "").slice(0,40)}</span><span class="ts">${ts}</span></div>`;
      }).join("")}</div>`;
      ctrls.insertAdjacentHTML("beforeend", html);
    } catch {}
  }

  /* =========================================================
     #12 · Capa de álbum no media
     ========================================================= */
  function decorateAlbumArt() {
    if (state.route !== "media") return;
    view.querySelectorAll(".player").forEach(card => {
      const id = card.dataset.entity;
      const ent = entity(id);
      const pic = ent?.attributes?.entity_picture;
      if (!pic || card.querySelector(".album-art")) return;
      const head = card.querySelector(".nm");
      if (!head) return;
      const wrap = document.createElement("div");
      wrap.className = "player-with-art";
      const art = document.createElement("div");
      art.className = "album-art";
      art.style.backgroundImage = `url("${pic}")`;
      const meta = document.createElement("div");
      meta.style.flex = "1";
      head.parentNode.insertBefore(wrap, head);
      wrap.appendChild(art); wrap.appendChild(meta);
      meta.appendChild(head);
      const np = card.querySelector(".nowplay");
      const ar = card.querySelector(".artist");
      if (np) meta.appendChild(np);
      if (ar) meta.appendChild(ar);
    });
  }

  /* =========================================================
     #14 · Join/Unjoin Echos
     ========================================================= */
  async function openJoinEchosModal() {
    const players = Object.values(state.entities).filter(e => e.entity_id.startsWith("media_player.echo"));
    openModal(`
      <div class="modal__head">
        <div><h2 class="modal__title">Sincronizar Echos</h2><div class="modal__sub">Tocar a mesma música em todos</div></div>
        <button class="modal__close" data-modal-close aria-label="Fechar">×</button>
      </div>
      <div class="modal__section">
        <div class="modal__label">Mestre (toca primeiro)</div>
        <div class="temp-row" id="echoMaster">${players.map(p => `<button class="temp-pill" data-master="${p.entity_id}">${friendly(p.entity_id, p.entity_id)}</button>`).join("")}</div>
      </div>
      <div class="modal__section">
        <div class="modal__label">Membros</div>
        <div class="temp-row" id="echoMembers">${players.map(p => `<button class="temp-pill" data-member="${p.entity_id}">${friendly(p.entity_id, p.entity_id)}</button>`).join("")}</div>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn--lime" id="doJoin">Agrupar</button>
        <button class="btn" id="doUnjoin">Desagrupar tudo</button>
      </div>
    `);
    let master = null;
    sheetEl.querySelectorAll("[data-master]").forEach(b => b.onclick = () => {
      sheetEl.querySelectorAll("[data-master]").forEach(x => x.classList.remove("is-active"));
      b.classList.add("is-active"); master = b.dataset.master;
    });
    sheetEl.querySelectorAll("[data-member]").forEach(b => b.onclick = () => b.classList.toggle("is-active"));
    sheetEl.querySelector("#doJoin").onclick = async () => {
      const members = Array.from(sheetEl.querySelectorAll("[data-member].is-active")).map(b => b.dataset.member).filter(m => m !== master);
      if (!master || !members.length) { toast("Escolha mestre + membros", "err"); return; }
      try { await callService("media_player", "join", { group_members: members }, { entity_id: master }); toast("Agrupado", "ok"); closeModal(); } catch {}
    };
    sheetEl.querySelector("#doUnjoin").onclick = async () => {
      try {
        await Promise.allSettled(players.map(p => callService("media_player", "unjoin", {}, { entity_id: p.entity_id })));
        toast("Desagrupado", "ok"); closeModal();
      } catch {}
    };
  }

  /* =========================================================
     #16 · Qualidade do ar / CO2
     ========================================================= */
  function injectAqiCard() {
    if (state.route !== "climate") return;
    if (view.querySelector(".aqi-card")) return;
    const aqi = Object.values(state.entities).find(e =>
      ["aqi","carbon_dioxide","volatile_organic_compounds","pm25"].includes(e.attributes?.device_class) ||
      /co2|aqi|voc|pm25/.test(e.entity_id)
    );
    const grid = view.querySelector(".climate-grid");
    if (!grid) return;
    if (!aqi) {
      grid.insertAdjacentHTML("beforeend", `<article class="card stat-card aqi-card"><div class="label">Qualidade do ar</div><div class="value" style="font-size:18px;">Sem sensor</div><div class="delta">Adicione um Aqara/Awair</div></article>`);
      return;
    }
    const v = parseFloat(aqi.state) || 0;
    const unit = aqi.attributes?.unit_of_measurement || "";
    const pct = Math.min(100, Math.max(0, (v / 1000) * 100));
    grid.insertAdjacentHTML("beforeend", `<article class="card stat-card aqi-card"><div class="label">${friendly(aqi.entity_id, "Ar")}</div><div class="ring2" style="--p:${pct}"><div class="in">${v.toFixed(0)}</div></div><div class="delta">${unit}</div></article>`);
  }

  /* =========================================================
     #18 · persistent_notification do HA no sino
     ========================================================= */
  const _origFetchNotifications = typeof fetchNotifications === "function" ? fetchNotifications : null;
  if (_origFetchNotifications) {
    fetchNotifications = async function () {
      const base = await _origFetchNotifications();
      try {
        const persist = Object.values(state.entities)
          .filter(e => e.entity_id.startsWith("persistent_notification."))
          .map(e => ({
            when: e.last_changed,
            entity_id: e.entity_id,
            name: e.attributes?.title || "Aviso",
            message: e.attributes?.message || e.state,
          }));
        return [...persist, ...base].slice(0, 50);
      } catch { return base; }
    };
  }

  /* =========================================================
     #19 · Snapshot automático ao abrir porta
     ========================================================= */
  const SNAP_GAL_KEY = "auroraDoorSnaps";
  function getSnaps() { try { return JSON.parse(localStorage.getItem(SNAP_GAL_KEY) || "[]"); } catch { return []; } }
  function saveSnap(url) {
    const arr = getSnaps(); arr.unshift({ t: Date.now(), url });
    localStorage.setItem(SNAP_GAL_KEY, JSON.stringify(arr.slice(0, 10)));
  }
  let lastDoorState = null;
  setInterval(async () => {
    const cur = entityState(ENTITY_MAP.security.door);
    const houseMode = entityState(ENTITY_MAP.houseMode);
    if (cur === "on" && lastDoorState !== "on" && houseMode !== "Em casa" && houseMode !== "Dia") {
      try {
        const url = await fetchCameraFrame(HOME_CAMERAS[0].id);
        if (url) {
          // Convert blob URL to data URL for persistence
          const blob = await fetch(url).then(r => r.blob());
          const reader = new FileReader();
          reader.onload = () => { saveSnap(reader.result); toast("📸 Snapshot capturado (porta aberta)", "info"); };
          reader.readAsDataURL(blob);
        }
      } catch {}
    }
    lastDoorState = cur;
  }, 5000);
  function openDoorSnapsModal() {
    const arr = getSnaps();
    openModal(`
      <div class="modal__head">
        <div><h2 class="modal__title">Snapshots da porta</h2><div class="modal__sub">Últimos 10 eventos</div></div>
        <button class="modal__close" data-modal-close aria-label="Fechar">×</button>
      </div>
      ${arr.length ? `<div class="snap-grid">${arr.map(s => `<div><img src="${s.url}" alt="snap"/><div class="muted" style="font-size:11px;text-align:center;margin-top:4px;">${new Date(s.t).toLocaleString("pt-BR")}</div></div>`).join("")}</div>` : `<div class="notif-empty">Sem snapshots</div>`}
    `);
  }

  /* =========================================================
     #20 · Pessoas em casa
     ========================================================= */
  function injectPersonsCard() {
    if (state.route !== "home") return;
    if (view.querySelector(".persons-card")) return;
    const persons = Object.values(state.entities).filter(e => e.entity_id.startsWith("person."));
    if (!persons.length) return;
    const html = `<article class="card persons-card" style="grid-column: span 3;">
      <div class="card-head"><span class="card-title">Quem está em casa</span></div>
      <div class="persons-row" style="margin-top:10px;">
        ${persons.map(p => {
          const home = p.state === "home";
          const pic = p.attributes?.entity_picture;
          const initial = (p.attributes?.friendly_name || p.entity_id.split(".")[1] || "?")[0].toUpperCase();
          return `<div class="person-pill ${home ? "is-home" : "is-away"}"><div class="av" ${pic?`style="background-image:url('${pic}')"`:""}>${pic?"":initial}</div><span>${friendly(p.entity_id, p.entity_id)} · ${home?"em casa":"fora"}</span></div>`;
        }).join("")}
      </div>
    </article>`;
    const grid = view.querySelector(".home-grid");
    if (grid) grid.insertAdjacentHTML("beforeend", html);
  }

  /* =========================================================
     #21 · Drag-reorder dos cards da home
     #22 · Esconder cômodos
     ========================================================= */
  const ORDER_KEY = "auroraHomeOrder";
  const HIDDEN_KEY = "auroraHiddenRooms";
  function getOrder() { try { return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]"); } catch { return []; } }
  function setOrder(o) { localStorage.setItem(ORDER_KEY, JSON.stringify(o)); }
  function getHiddenRooms() { try { return JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]"); } catch { return []; } }
  function setHiddenRooms(o) { localStorage.setItem(HIDDEN_KEY, JSON.stringify(o)); }

  function applyHomeLayout() {
    if (state.route !== "home") return;
    const grid = view.querySelector(".home-grid");
    if (!grid) return;
    // Hide rooms
    const hidden = getHiddenRooms();
    hidden.forEach(id => {
      grid.querySelectorAll(`[data-group-key="${id}"]`).forEach(el => el.style.display = "none");
    });
    // Apply saved order
    const order = getOrder();
    if (order.length) {
      const map = new Map();
      Array.from(grid.children).forEach(c => {
        const key = c.dataset.entity || c.dataset.cameraFullscreen || c.className;
        map.set(key, c);
      });
      order.forEach(k => { const el = map.get(k); if (el) grid.appendChild(el); });
    }
    // Make draggable
    Array.from(grid.children).forEach(card => {
      card.setAttribute("draggable", "true");
      card.addEventListener("dragstart", () => card.classList.add("dragging"));
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        const newOrder = Array.from(grid.children).map(c => c.dataset.entity || c.dataset.cameraFullscreen || c.className);
        setOrder(newOrder);
      });
      card.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = grid.querySelector(".dragging");
        if (!dragging || dragging === card) return;
        const rect = card.getBoundingClientRect();
        const after = (e.clientY - rect.top) > rect.height / 2;
        grid.insertBefore(dragging, after ? card.nextSibling : card);
      });
    });
  }

  /* =========================================================
     #24 · Modo quiosque
     ========================================================= */
  function applyKioskMode() {
    const s = getSettings();
    document.body.classList.toggle("is-kiosk", !!s.kiosk);
  }
  applyKioskMode();

  /* =========================================================
     #25 · Command Palette ⌘K
     ========================================================= */
  const cmdkEl = document.createElement("div");
  cmdkEl.className = "cmdk";
  cmdkEl.innerHTML = `<div class="cmdk__sheet"><input id="cmdkInput" placeholder="Buscar dispositivos, cenas, rotas… (Esc para sair)" autocomplete="off"/><div class="cmdk__list" id="cmdkList"></div></div>`;
  document.body.appendChild(cmdkEl);
  const cmdkInput = cmdkEl.querySelector("#cmdkInput");
  const cmdkList = cmdkEl.querySelector("#cmdkList");

  function buildCmdItems() {
    const items = [];
    ROUTES.forEach(r => items.push({ label: `Ir para ${r}`, kbd: r, run: () => go(r) }));
    items.push({ label: "Abrir Cenas", run: () => openScenesModal() });
    items.push({ label: "Modo da Casa", run: () => openHouseModeModal() });
    items.push({ label: "Notificações", run: () => openNotifModal() });
    items.push({ label: "Ajustes", run: () => openSettingsModal() });
    items.push({ label: "Calendário", run: () => openCalendarModal() });
    items.push({ label: "Listas (Todo)", run: () => openTodoModal() });
    items.push({ label: "Intercom (TTS)", run: () => openIntercomModal() });
    items.push({ label: "Auditoria", run: () => openAuditModal() });
    items.push({ label: "Auto. HA · Cenas/Scripts/Automações", run: () => openHaAutomationsModal() });
    items.push({ label: "Sincronizar Echos", run: () => openJoinEchosModal() });
    items.push({ label: "Snapshots da porta", run: () => openDoorSnapsModal() });
    Object.values(state.entities || {}).slice(0, 200).forEach(e => {
      if (e.entity_id.startsWith("light.") || e.entity_id.startsWith("switch.")) {
        items.push({ label: `Toggle: ${friendly(e.entity_id, e.entity_id)}`, kbd: e.entity_id, run: () => toggleEntity(e.entity_id) });
      }
    });
    return items;
  }
  function openCmdk() { cmdkEl.classList.add("is-on"); cmdkInput.value = ""; renderCmdk(""); cmdkInput.focus(); }
  function closeCmdk() { cmdkEl.classList.remove("is-on"); }
  function renderCmdk(q) {
    const items = buildCmdItems();
    const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    const nq = norm(q);
    const filtered = nq ? items.filter(i => norm(i.label).includes(nq) || norm(i.kbd || "").includes(nq)) : items;
    cmdkList.innerHTML = filtered.slice(0, 30).map((it, i) => `<div class="cmdk__item ${i===0?"is-active":""}" data-idx="${i}"><span>${it.label}</span>${it.kbd?`<span class="kbd">${it.kbd}</span>`:""}</div>`).join("");
    cmdkList.querySelectorAll(".cmdk__item").forEach(el => el.onclick = () => { filtered[+el.dataset.idx].run(); closeCmdk(); });
    cmdkList._items = filtered;
  }
  cmdkInput.addEventListener("input", (e) => renderCmdk(e.target.value));
  cmdkInput.addEventListener("keydown", (e) => {
    const items = cmdkList._items || [];
    const active = cmdkList.querySelector(".is-active");
    let idx = active ? +active.dataset.idx : 0;
    if (e.key === "Escape") closeCmdk();
    else if (e.key === "Enter") { items[idx]?.run(); closeCmdk(); }
    else if (e.key === "ArrowDown") { idx = Math.min(items.length - 1, idx + 1); cmdkList.querySelectorAll(".cmdk__item").forEach((el,i)=>el.classList.toggle("is-active", i===idx)); cmdkList.children[idx]?.scrollIntoView({block:"nearest"}); e.preventDefault(); }
    else if (e.key === "ArrowUp") { idx = Math.max(0, idx - 1); cmdkList.querySelectorAll(".cmdk__item").forEach((el,i)=>el.classList.toggle("is-active", i===idx)); cmdkList.children[idx]?.scrollIntoView({block:"nearest"}); e.preventDefault(); }
  });
  cmdkEl.addEventListener("click", (e) => { if (e.target === cmdkEl) closeCmdk(); });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openCmdk(); }
  });
  // search input no topbar abre cmdk
  document.querySelector(".search input")?.addEventListener("focus", openCmdk);

  /* =========================================================
     #27 · PWA install + push
     ========================================================= */
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredPrompt = e; });
  async function tryInstallPWA() {
    if (!deferredPrompt) { toast("Já instalado ou navegador não suporta", "info"); return; }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    toast(outcome === "accepted" ? "Instalado!" : "Cancelado", "info");
    deferredPrompt = null;
  }
  async function tryPushNotif() {
    if (!("Notification" in window)) { toast("Sem suporte a notificações", "err"); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") { new Notification("Casa", { body: "Notificações ativadas ✓" }); toast("Notificações ativadas", "ok"); }
    else toast("Permissão negada", "err");
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/dashboard/sw.js").catch(() => {});
  }

  /* =========================================================
     Settings v3 — extensão do modal
     ========================================================= */
  const _origSettings = openSettingsModal;
  openSettingsModal = function () {
    _origSettings();
    const s = getSettings();
    const allRooms = Object.entries(ENTITY_MAP.groups);
    const hidden = getHiddenRooms();

    const sec = document.createElement("div");
    sec.className = "modal__section";
    sec.innerHTML = `
      <div class="modal__label">Servidor Home Assistant</div>
      <input id="haUrlInput" type="text" placeholder="https://meu-ha.duckdns.org (vazio = mesmo host)" value="${localStorage.getItem(HA_URL_KEY) || ""}" style="width:100%;padding:12px 14px;border-radius:14px;border:1px solid var(--glass-stroke);background:var(--glass-2);color:inherit;outline:none;" />
      <div style="display:flex;gap:10px;margin-top:8px;"><button class="btn btn--lime" id="saveHaUrl">Salvar URL</button><button class="btn" id="clearHaUrl">Limpar</button></div>
    `;
    sheetEl.appendChild(sec);
    sec.querySelector("#saveHaUrl").onclick = () => {
      const v = sec.querySelector("#haUrlInput").value.trim();
      if (v) localStorage.setItem(HA_URL_KEY, v); else localStorage.removeItem(HA_URL_KEY);
      toast("URL salva — recarregando", "ok"); setTimeout(() => location.reload(), 600);
    };
    sec.querySelector("#clearHaUrl").onclick = () => { localStorage.removeItem(HA_URL_KEY); location.reload(); };

    const roomsSec = document.createElement("div");
    roomsSec.className = "modal__section";
    roomsSec.innerHTML = `
      <div class="modal__label">Cômodos visíveis na Home</div>
      <div class="room-toggle-list">
        ${allRooms.map(([k, id]) => `<label><input type="checkbox" data-room="${id}" ${hidden.includes(id)?"":"checked"}/> ${k}</label>`).join("")}
      </div>
      <div class="muted" style="font-size:11px;margin-top:6px;">Arraste os cards na home para reordenar.</div>
    `;
    sheetEl.appendChild(roomsSec);
    roomsSec.querySelectorAll("[data-room]").forEach(cb => cb.onchange = () => {
      const id = cb.dataset.room;
      const cur = getHiddenRooms();
      const next = cb.checked ? cur.filter(x => x !== id) : [...cur, id];
      setHiddenRooms(next);
      if (state.route === "home") render();
    });

    const kioskSec = document.createElement("div");
    kioskSec.className = "modal__section";
    kioskSec.innerHTML = `
      <div class="modal__label">Modo quiosque (tablet)</div>
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" id="kioskCb" ${s.kiosk?"checked":""}/> Esconder sidebar e barra de busca</label>
    `;
    sheetEl.appendChild(kioskSec);
    kioskSec.querySelector("#kioskCb").onchange = (e) => { setSettings({ kiosk: e.target.checked }); applyKioskMode(); };

    const moreSec = document.createElement("div");
    moreSec.className = "modal__section";
    moreSec.innerHTML = `
      <div class="modal__label">Mais</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <button class="btn" id="openAutosBtn">Cenas/Scripts/Automações</button>
        <button class="btn" id="openEchosBtn">Sincronizar Echos</button>
        <button class="btn" id="openSnapsBtn">Snapshots porta</button>
        <button class="btn" id="installPwaBtn">Instalar app (PWA)</button>
        <button class="btn" id="enablePushBtn">Ativar notificações</button>
      </div>
    `;
    sheetEl.appendChild(moreSec);
    moreSec.querySelector("#openAutosBtn").onclick = () => { closeModal(); openHaAutomationsModal(); };
    moreSec.querySelector("#openEchosBtn").onclick = () => { closeModal(); openJoinEchosModal(); };
    moreSec.querySelector("#openSnapsBtn").onclick = () => { closeModal(); openDoorSnapsModal(); };
    moreSec.querySelector("#installPwaBtn").onclick = tryInstallPWA;
    moreSec.querySelector("#enablePushBtn").onclick = tryPushNotif;
  };

  /* =========================================================
     Hooks no render
     ========================================================= */
  const _origRender = render;
  render = function () {
    _origRender();
    setTimeout(() => {
      injectEnergyCard();
      injectPersonsCard();
      applyHomeLayout();
      injectAqiCard();
      decorateAlbumArt();
      injectTalkBackBtn();
      injectBabyTimeline();
      checkBabyTempAlert();
    }, 50);
  };

  // dispara hooks também no boot
  setTimeout(() => {
    injectEnergyCard();
    injectPersonsCard();
    applyHomeLayout();
    injectAqiCard();
    decorateAlbumArt();
    injectTalkBackBtn();
    injectBabyTimeline();
  }, 1500);

  console.log("[v3] expansion pack carregado ✓");
})();
