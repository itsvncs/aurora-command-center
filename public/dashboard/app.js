// =========================================================
// Casa · Home Assistant Dashboard — app.js
// HTML/CSS/JS puro · Pronto para integração HA via REST/WS
// =========================================================

// ---------- Mock state (substituir por HA WS/REST) ----------
const state = {
  greeting: { name: "Wendell", line: "Sua casa está tranquila — 22°C, tudo seguro." },
  weather: { temp: 24, desc: "Parcialmente nublado", city: "São Paulo" },
  rooms: [
    { id: "sala",      name: "Sala",          devices: 6, on: true,  temp: 23 },
    { id: "cozinha",   name: "Cozinha",       devices: 4, on: false, temp: 24 },
    { id: "servicos",  name: "Serviços",      devices: 2, on: false, temp: 25 },
    { id: "esther",    name: "Quarto Esther", devices: 5, on: true,  temp: 22 },
    { id: "suite",     name: "Suíte",         devices: 7, on: false, temp: 22 },
  ],
  lights: [
    { entity: "light.sala_teto",     name: "Teto Sala",       room: "Sala",    on: true,  bri: 70 },
    { entity: "light.sala_lustre",   name: "Lustre",          room: "Sala",    on: false, bri: 0  },
    { entity: "light.cozinha_teto",  name: "Teto Cozinha",    room: "Cozinha", on: false, bri: 0  },
    { entity: "light.servicos_teto", name: "Teto Serviços",   room: "Serviços",on: false, bri: 0  },
    { entity: "light.teto",          name: "Teto Esther",     room: "Esther",  on: true,  bri: 35 },
    { entity: "light.led_esther",    name: "LED Esther",      room: "Esther",  on: true,  bri: 60 },
    { entity: "light.suite_teto",    name: "Teto Suíte",      room: "Suíte",   on: false, bri: 0  },
    { entity: "light.suite_abajur",  name: "Abajur Suíte",    room: "Suíte",   on: true,  bri: 25 },
  ],
  climate: { indoor: 22.4, comp: 22.0, humidity: 56, comfort: "Ótimo" },
  security: { door: "fechada", presence: "ninguém", alerts: 0, cameras: 4 },
  media: { now: "Berceuse Lullaby", artist: "Calm Kids", playing: true, vol: 32 },
  baby: {
    occupied: true,
    lastFace: { name: "Esther", at: "21:14" },
    temp: 22.4,
    tempComp: 22.1,
    humidity: 58,
    whiteNoise: true,
    echo: { state: "playing", track: "Berceuse Lullaby", artist: "Calm Kids" },
    light_teto: true,
    light_led: true,
    aquecedor: false,
    cameraLive: true,
  },
};

// ---------- HA bridge (placeholder) ----------
const HA = {
  // const conn = new WebSocket(`wss://homeassistant.local:8123/api/websocket`);
  // auth: process.env.HA_TOKEN
  callService(domain, service, data) {
    console.log("[HA] callService", domain, service, data);
    // return fetch("/api/services/" + domain + "/" + service, {method:"POST", body: JSON.stringify(data)})
  },
  subscribe(entity, cb) { /* WS subscribe_events */ },
  getState(entity) { /* GET /api/states/{entity} */ },
};

// ---------- Util ----------
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const html = (strings, ...v) => strings.map((s,i)=>s+(v[i] ?? "")).join("");

// ---------- Router ----------
const ROUTES = {
  home:     { title: "Boa noite, Wendell", sub: "Sua casa está tranquila — 22°C, tudo seguro.",   render: renderHome },
  lights:   { title: "Iluminação",         sub: "Controle todas as luzes e tomadas por cômodo.",   render: renderLights },
  climate:  { title: "Clima",              sub: "Conforto térmico e umidade da casa.",             render: renderClimate },
  security: { title: "Segurança",          sub: "Câmeras, presença e alertas em tempo real.",      render: renderSecurity },
  media:    { title: "Mídia",              sub: "TV, Echo e players controlados em um só lugar.",  render: renderMedia },
  baby:     { title: "Quarto da Esther",   sub: "Monitoramento ao vivo e ambiente do quarto.",     render: renderBaby },
};

function go(route) {
  const r = ROUTES[route]; if (!r) return;
  $$("#nav .nav-item").forEach(n => n.classList.toggle("is-active", n.dataset.route === route));
  $("#pageTitle").textContent = r.title;
  $("#pageSub").textContent = r.sub;
  const view = $("#view");
  view.style.opacity = "0";
  view.style.transform = "translateY(8px)";
  requestAnimationFrame(() => {
    setTimeout(() => {
      view.innerHTML = r.render();
      view.style.transition = "opacity .4s var(--ease-out), transform .4s var(--ease-out)";
      view.style.opacity = "1";
      view.style.transform = "translateY(0)";
      bindView(route);
    }, 120);
  });
}

document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-route]");
  if (nav) go(nav.dataset.route);
});

// ---------- VIEWS ----------

function renderHome() {
  const onCount = state.lights.filter(l => l.on).length;
  return html`
    <div class="home-grid">
      <!-- HERO câmera -->
      <article class="card hero">
        <div class="hero__feed"></div>
        <div class="hero__overlay">
          <div class="hero__top">
            <div class="hero__tabs">
              <button class="is-active">Quarto Esther</button>
              <button>Sala</button>
              <button>Entrada</button>
              <button>Garagem</button>
            </div>
            <span class="chip chip--live"><span class="pulse"></span> Live</span>
          </div>
          <div class="hero__bottom">
            <div>
              <h2 class="hero__title">Câmera · Quarto Esther</h2>
              <p class="hero__meta">1080p · Ocupado · Ruído branco ligado</p>
            </div>
            <div class="hero__actions">
              <button class="btn btn--ghost">Captura</button>
              <button class="btn btn--lime" data-route="baby">Abrir Babytracker</button>
            </div>
          </div>
        </div>
      </article>

      <!-- Stats -->
      <article class="card stat-card card--accent">
        <div class="card-head">
          <span class="card-title" style="color:rgba(10,12,15,.7)">Energia hoje</span>
          <div class="card-icon" style="background:rgba(10,12,15,.12);border-color:transparent;color:#0a0c0f">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"/></svg>
          </div>
        </div>
        <div class="value">12,4 <small style="font-size:14px;font-weight:500">kWh</small></div>
        <div class="muted tiny" style="margin-top:6px">−8% vs. ontem</div>
      </article>

      <article class="card stat-card">
        <div class="card-head">
          <span class="card-title">Luzes acesas</span>
          <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.7.6 1 1.4 1 2.3h6c0-.9.3-1.7 1-2.3A7 7 0 0 0 12 2z"/></svg></div>
        </div>
        <div class="value">${onCount}<small style="font-size:14px;color:var(--c-ink-mute);font-weight:500"> / ${state.lights.length}</small></div>
        <div class="delta">tudo sob controle</div>
      </article>

      <!-- Cômodos -->
      ${state.rooms.slice(0,3).map(r => roomCard(r)).join("")}

      <!-- Cenas -->
      <article class="card" style="grid-column: span 3">
        <div class="card-head">
          <span class="card-title">Cenas rápidas</span>
          <button class="btn btn--ghost tiny">Editar</button>
        </div>
        <div class="scenes">
          ${["Bom dia","Cinema","Jantar","Dormir"].map((n,i)=>html`
            <button class="scene" data-scene="${n}">
              <span class="ic" style="background:${["#d6ff4d22","#b39dff22","#ffd84a22","#7dd3fc22"][i]};color:${["#d6ff4d","#b39dff","#ffd84a","#7dd3fc"][i]}">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>
              </span>
              <span class="nm">${n}</span>
              <span class="sb">${["Café e cortinas","Luzes 30%","Música suave","Tudo apagado"][i]}</span>
            </button>`).join("")}
        </div>
      </article>
    </div>
  `;
}

function roomCard(r) {
  return html`
    <article class="card room-card ${r.on?"is-on":""}" data-room="${r.id}">
      <div class="row">
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>
        </div>
        <div class="switch ${r.on?"is-on":""}" data-toggle-room="${r.id}"></div>
      </div>
      <div>
        <div class="name">${r.name}</div>
        <div class="stat">${r.devices} dispositivos · ${r.temp}°</div>
      </div>
    </article>`;
}

function renderLights() {
  return html`
    <div class="section-head"><h2>Todos os cômodos</h2><span class="muted tiny">${state.lights.filter(l=>l.on).length} acesas de ${state.lights.length}</span></div>
    <div class="lights-grid">
      ${state.lights.map(l => lightCard(l)).join("")}
    </div>
  `;
}
function lightCard(l) {
  return html`
    <article class="card light-card" data-entity="${l.entity}">
      <div class="top">
        <div>
          <div class="nm">${l.name}</div>
          <div class="sb">${l.room} · ${l.on?l.bri+"%":"desligada"}</div>
        </div>
        <div class="switch ${l.on?"is-on":""}" data-toggle-light="${l.entity}"></div>
      </div>
      <div class="slider"><span style="width:${l.on?l.bri:0}%"></span></div>
    </article>`;
}

function renderClimate() {
  const c = state.climate;
  const p = Math.min(100, Math.max(0, (c.indoor-15)/15*100));
  return html`
    <div class="climate-grid">
      <article class="card gauge-card" style="text-align:center">
        <div class="card-head" style="justify-content:center;gap:10px">
          <span class="card-title">Temperatura interna</span>
        </div>
        <div class="gauge" style="--p:${p}"><div class="v"><b>${c.indoor}°</b><small>compensada ${c.comp}°</small></div></div>
        <div class="chip chip--lime"><span class="pulse"></span> ${c.comfort}</div>
      </article>

      <article class="card stat-card">
        <div class="card-head"><span class="card-title">Umidade</span>
          <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2s6 7 6 12a6 6 0 1 1-12 0c0-5 6-12 6-12z"/></svg></div>
        </div>
        <div class="value">${c.humidity}<small style="font-size:14px;color:var(--c-ink-mute)">%</small></div>
        <div class="delta">faixa confortável</div>
      </article>

      <article class="card stat-card">
        <div class="card-head"><span class="card-title">Externo</span>
          <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg></div>
        </div>
        <div class="value">${state.weather.temp}°</div>
        <div class="muted tiny" style="margin-top:6px">${state.weather.desc}</div>
      </article>
    </div>
  `;
}

function renderSecurity() {
  return html`
    <div class="sec-grid">
      <article class="card hero" style="min-height:380px;padding:0">
        <div class="hero__feed"></div>
        <div class="hero__overlay">
          <div class="hero__top">
            <div class="hero__tabs">
              <button class="is-active">Entrada</button>
              <button>Garagem</button>
              <button>Sala</button>
              <button>Esther</button>
            </div>
            <span class="chip chip--live"><span class="pulse"></span> Live</span>
          </div>
          <div class="hero__bottom">
            <div><h2 class="hero__title">Câmera · Entrada</h2><p class="hero__meta">1080p · sem movimento · porta fechada</p></div>
            <div class="hero__actions"><button class="btn">Histórico</button><button class="btn btn--lime">Falar</button></div>
          </div>
        </div>
      </article>
      <div style="display:grid;gap:16px">
        ${[
          ["Porta principal","Fechada","ok","M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"],
          ["Presença","Ninguém em casa","muted","M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 21c1-4 4-6 8-6s7 2 8 6"],
          ["Alertas (24h)","0 alertas","ok","M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"],
          ["Câmeras online","4 / 4","lime","M23 7 16 12l7 5V7zM2 6h13v12H2z"],
        ].map(([t,v,c,d])=>html`
          <article class="card">
            <div class="card-head"><span class="card-title">${t}</span>
              <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="${d}"/></svg></div>
            </div>
            <div class="big-num">${v}</div>
            ${c==="ok"?'<span class="chip chip--ok"><span class="pulse"></span> Tudo ok</span>':c==="lime"?'<span class="chip chip--lime"><span class="pulse"></span> Online</span>':'<span class="chip">Sem atividade</span>'}
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderMedia() {
  return html`
    <div class="media-grid">
      <article class="card player">
        <div class="art">♪</div>
        <div>
          <div class="nm" style="font-family:var(--f-display);font-size:18px;font-weight:700">${state.media.now}</div>
          <div class="muted tiny">${"Calm Kids · Berceuse"}</div>
        </div>
        <div class="progress"><span></span></div>
        <div class="ctrls">
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg></button>
          <button class="pp" data-pp><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg></button>
          <button class="icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></button>
        </div>
      </article>

      ${[
        ["TV Sala","LG OLED · Netflix","ok"],
        ["Echo Quarto","Tocando · vol 32","lime"],
        ["Echo Sala","Inativo","muted"],
        ["Sonos Cozinha","Pausado","muted"],
      ].map(([n,s,c])=>html`
        <article class="card">
          <div class="card-head"><span class="card-title">${n}</span>
            <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8"/></svg></div>
          </div>
          <div class="big-num" style="font-size:22px">${s}</div>
          <div style="margin-top:14px;display:flex;gap:8px"><button class="btn">⏯</button><button class="btn">+</button><button class="btn">−</button></div>
        </article>
      `).join("")}
    </div>
  `;
}

// =========================================================
// BABYTRACKER (estrela)
// =========================================================
function renderBaby() {
  const b = state.baby;
  return html`
    <div class="baby">
      <!-- LINHA 1: 5 cards -->
      <div class="baby__row1">

        <!-- 1) Status -->
        <article class="card baby-card baby-status ${b.occupied?"is-occupied":""}" data-card="status">
          <div class="head">
            <div>
              <div class="ttl">Status do berço</div>
              <div class="sub">Detecção em tempo real</div>
            </div>
            <span class="chip ${b.occupied?'chip--lime':''}"><span class="pulse"></span> ${b.occupied?"Ocupado":"Vazio"}</span>
          </div>
          <div class="big-num" style="font-size:30px">${b.occupied?"Dormindo":"—"}</div>
          <div class="face">
            <div class="av">${b.lastFace.name[0]}</div>
            <div>
              <div class="nm">${b.lastFace.name}</div>
              <div class="tm">Última detecção · ${b.lastFace.at}</div>
            </div>
          </div>
        </article>

        <!-- 2) Temperatura -->
        <article class="card baby-card baby-temp" data-card="temp">
          <div class="head">
            <div>
              <div class="ttl">Temperatura</div>
              <div class="sub">Quarto Esther</div>
            </div>
            <span class="chip chip--ok"><span class="pulse"></span> Ideal</span>
          </div>
          <div class="row">
            <div class="ring"><b>${b.temp}°</b></div>
            <div>
              <div class="muted tiny">COMPENSADA</div>
              <div style="font-family:var(--f-display);font-size:22px;font-weight:700">${b.tempComp}°</div>
              <div class="muted tiny" style="margin-top:6px">Umidade ${b.humidity}%</div>
            </div>
          </div>
        </article>

        <!-- 3) Mídia (Echo) -->
        <article class="card baby-card baby-media ${b.echo.state==='paused'?'is-paused':''}" data-card="media">
          <div class="head">
            <div>
              <div class="ttl">Echo do quarto</div>
              <div class="sub">media_player.echo_quarto</div>
            </div>
            <div class="vol"><i></i><i></i><i></i><i></i></div>
          </div>
          <div>
            <div class="nowplay">${b.echo.track}</div>
            <div class="artist">${b.echo.artist}</div>
          </div>
          <div class="ctrls">
            <button class="icon-btn" data-media="prev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg></button>
            <button class="pp" data-media="pp">
              ${b.echo.state==='playing'
                ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
                : '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>'}
            </button>
            <button class="icon-btn" data-media="next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg></button>
          </div>
        </article>

        <!-- 4) Ruído branco -->
        <article class="card baby-card baby-noise ${b.whiteNoise?'is-on':''}" data-card="noise">
          <div class="head">
            <div>
              <div class="ttl">Ruído branco</div>
              <div class="sub">input_boolean.ruido_branco</div>
            </div>
            <span class="chip ${b.whiteNoise?'chip--lime':''}">${b.whiteNoise?'Ligado':'Desligado'}</span>
          </div>
          <div class="wave">
            <svg viewBox="0 0 200 40" preserveAspectRatio="none">
              <path d="M0 20 Q 10 5, 20 20 T 40 20 T 60 20 T 80 20 T 100 20 T 120 20 T 140 20 T 160 20 T 180 20 T 200 20" fill="none" stroke="${b.whiteNoise?'#7dd3fc':'#5a5f68'}" stroke-width="2"/>
            </svg>
          </div>
          <div class="btns">
            <button class="${b.whiteNoise?'is-active':''}" data-noise="on">Ligar</button>
            <button class="${!b.whiteNoise?'is-active':''}" data-noise="off">Desligar</button>
          </div>
        </article>

        <!-- 5) Controles -->
        <article class="card baby-card baby-ctrls" data-card="ctrls">
          <div class="head">
            <div>
              <div class="ttl">Controles</div>
              <div class="sub">Iluminação e aquecedor</div>
            </div>
          </div>
          <div>
            ${babyToggle("Teto",       "light_teto",  b.light_teto, "light.teto")}
            ${babyToggle("LED Esther", "light_led",   b.light_led,  "switch.cozylife_66c5")}
            ${babyToggle("Aquecedor",  "aquecedor",   b.aquecedor,  "switch.aquecedor_interruptor_1")}
          </div>
        </article>

      </div>

      <!-- LINHA 2: CÂMERA GIGANTE -->
      <article class="baby__cam">
        <div class="feed"></div>
        <div class="ovl">
          <div class="top">
            <span class="pill live"><span class="pulse"></span> AO VIVO</span>
            <div style="display:flex;gap:8px">
              <span class="pill">1080p · 30fps</span>
              <span class="pill">camera.berco_2</span>
            </div>
          </div>
          <div class="bot">
            <div>
              <div class="nm">Berço · Esther</div>
              <div class="meta">Quarto silencioso · ruído branco ligado · ${b.temp}°</div>
            </div>
            <div class="acts">
              <button class="btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>Captura</button>
              <button class="btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>Falar</button>
              <button class="btn btn--lime">Tela cheia</button>
            </div>
          </div>
        </div>
      </article>
    </div>
  `;
}
function babyToggle(name, key, on, entity) {
  return html`
    <div class="toggle-row ${on?'is-on':''}" data-baby-toggle="${key}" data-entity="${entity}">
      <div>
        <div class="nm">${name}</div>
        <div class="sb">${entity}</div>
      </div>
      <div class="switch ${on?'is-on':''}"></div>
    </div>`;
}

// =========================================================
// BIND — atualizações localizadas (sem rerender full)
// =========================================================
function bindView(route) {
  // Toggle de luz (Luzes page)
  $$("[data-toggle-light]").forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      const id = el.dataset.toggleLight;
      const l = state.lights.find(x => x.entity === id);
      l.on = !l.on; if (l.on && l.bri === 0) l.bri = 70; if (!l.on) l.bri = 0;
      // Atualiza apenas este card (sem rerender full)
      const card = el.closest(".light-card");
      el.classList.toggle("is-on", l.on);
      card.querySelector(".sb").textContent = `${l.room} · ${l.on?l.bri+"%":"desligada"}`;
      card.querySelector(".slider span").style.width = (l.on?l.bri:0) + "%";
      HA.callService("light", l.on?"turn_on":"turn_off", { entity_id: id });
    });
  });

  // Toggle cômodo (Home)
  $$("[data-toggle-room]").forEach(el => {
    el.addEventListener("click", e => {
      e.stopPropagation();
      const id = el.dataset.toggleRoom;
      const r = state.rooms.find(x => x.id === id);
      r.on = !r.on;
      el.classList.toggle("is-on", r.on);
      el.closest(".room-card").classList.toggle("is-on", r.on);
    });
  });

  // Cenas
  $$("[data-scene]").forEach(b => b.addEventListener("click", () => {
    b.animate([{transform:"scale(1)"},{transform:"scale(.96)"},{transform:"scale(1)"}],{duration:200,easing:"ease-out"});
    HA.callService("scene", "turn_on", { entity_id: "scene." + b.dataset.scene.toLowerCase().replace(/\s/g,"_") });
  }));

  if (route === "baby") bindBaby();
  if (route === "media") bindMedia();
}

function bindBaby() {
  // Toggles individuais
  $$("[data-baby-toggle]").forEach(el => {
    el.addEventListener("click", () => {
      const key = el.dataset.babyToggle;
      state.baby[key] = !state.baby[key];
      const on = state.baby[key];
      el.classList.toggle("is-on", on);
      el.querySelector(".switch").classList.toggle("is-on", on);
      // Animação sutil
      el.animate([{transform:"scale(1)"},{transform:"scale(.985)"},{transform:"scale(1)"}],{duration:220,easing:"ease-out"});
      HA.callService("homeassistant", on?"turn_on":"turn_off", { entity_id: el.dataset.entity });
    });
  });

  // Ruído branco
  $$("[data-noise]").forEach(b => b.addEventListener("click", () => {
    const on = b.dataset.noise === "on";
    state.baby.whiteNoise = on;
    const card = b.closest(".baby-noise");
    card.classList.toggle("is-on", on);
    card.querySelectorAll("[data-noise]").forEach(x => x.classList.toggle("is-active", x.dataset.noise===(on?"on":"off")));
    card.querySelector(".chip").textContent = on?"Ligado":"Desligado";
    card.querySelector(".chip").classList.toggle("chip--lime", on);
    card.querySelector("svg path").setAttribute("stroke", on?"#7dd3fc":"#5a5f68");
    HA.callService("input_boolean", on?"turn_on":"turn_off", { entity_id: "input_boolean.ruido_branco" });
  }));

  // Media play/pause local
  const ppBtn = $('[data-media="pp"]');
  ppBtn?.addEventListener("click", () => {
    const playing = state.baby.echo.state === "playing";
    state.baby.echo.state = playing ? "paused" : "playing";
    const card = ppBtn.closest(".baby-media");
    card.classList.toggle("is-paused", playing);
    ppBtn.innerHTML = playing
      ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>'
      : '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    HA.callService("media_player", playing?"media_pause":"media_play", { entity_id:"media_player.echo_quarto" });
  });
}

function bindMedia() {
  $('[data-pp]')?.addEventListener("click", e => {
    const b = e.currentTarget;
    state.media.playing = !state.media.playing;
    b.innerHTML = state.media.playing
      ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>';
  });
}

// ---------- Boot ----------
$("#wxTemp").textContent = state.weather.temp + "°";
go("home");
